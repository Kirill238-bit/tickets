<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log'); // Log errors to a file

try {
    $db = new PDO('sqlite:db.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("Connected to SQLite database.");
} catch (PDOException $e) {
     // Log the error message
     error_log("Database connection error: " . $e->getMessage());
     // Send a generic error response
     http_response_code(500);
     echo json_encode(['error' => 'Internal Server Error']);
     exit();
}

// Handle GET request for tickets
if ($_SERVER['REQUEST_METHOD'] === 'GET' && strpos($_SERVER['REQUEST_URI'], '/api/tickets') !== false) {
    $transfers = isset($_GET['transfers']) ? $_GET['transfers'] : null;
    $departure = isset($_GET['departure']) ? $_GET['departure'] : null;
    $arrive = isset($_GET['arrive']) ? $_GET['arrive'] : null;
    $date_from = isset($_GET['date_from']) ? $_GET['date_from'] : null;

    $query = 'SELECT * FROM tickets';
    $params = [];

    if ($transfers !== null) {
        $transferValues = explode(';', $transfers);
        $placeholders = implode(',', array_fill(0, count($transferValues), '?'));
        $query .= " WHERE stops IN ($placeholders)";
        $params = array_merge($params, $transferValues);
    }
    if ($departure && $arrive && $date_from) {
        $query .= $transfers !== null ? ' AND' : ' WHERE';
        $query .= ' LOWER(origin_name) = LOWER(?) AND LOWER(destination_name) = LOWER(?) AND departure_date = ?';
        $params = array_merge($params, [$departure, $arrive, $date_from]);
    }

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['tickets' => $tickets]);
    exit();
}

// Handle POST request for booking a ticket
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($_SERVER['REQUEST_URI'], '/api/tickets/book') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'];
    $ticketId = $input['ticketId'];
    $username = $input['username'];

    try {
        $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        $bookTicket = function($userId) use ($db, $ticketId, $email) {
            try {
                $db->beginTransaction();

                $stmt = $db->prepare('INSERT INTO bookings (user_id, ticket_id) VALUES (?, ?)');
                $stmt->execute([$userId, $ticketId]);

                $stmt = $db->prepare('UPDATE tickets SET available_seats = available_seats - 1 WHERE id = ?');
                $stmt->execute([$ticketId]);

                $db->commit();
                echo json_encode(['message' => "Билет $ticketId успешно забронирован $email"]);
            } catch (PDOException $e) {
                $db->rollBack();
                http_response_code(500);
                echo json_encode(['error' => 'Ошибка обновления количества доступных мест']);
            }
        };

        if ($user) {
            $bookTicket($user['id']);
        } else {
            try {
                $stmt = $db->prepare('INSERT INTO users (email, username) VALUES (?, ?)');
                $stmt->execute([$email, $username]);
                $userId = $db->lastInsertId();
                $bookTicket($userId);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error processing request']);
    }
    exit();
}

?>