

<?php
// Assuming you have a function to get the ticket data
function getTicketData($id, $currency) {
    $url = "http://localhost:7070/api/tickets/$id?currency=$currency";
    $response = file_get_contents($url);
    return json_decode($response, true);
}

// Assuming you have a function to book the ticket
function bookTicket($email, $ticketId, $username) {
    $url = "http://localhost:7070/api/tickets/book";
    $data = array(
        'email' => $email,
        'ticketId' => $ticketId,
        'username' => $username
    );
    $options = array(
        'http' => array(
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
        ),
    );
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    return json_decode($result, true);
}

// Get ticket ID and currency from the request
$id = $_GET['id'];
$currency = $_GET['currency'];

// Fetch ticket data
$data = getTicketData($id, $currency);

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $name = $_POST['name'];
    $result = bookTicket($email, $id, $name);
    if ($result['success']) {
        echo "<p>Билет успешно забронирован!</p>";
    } else {
        echo "<p>Error: " . $result['error'] . "</p>";
    }
}

?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Ticket Page</title>
    <style>
        /* Add your CSS styles here */
    </style>
</head>
<body>
    <div>
        <h2><?php echo $data['stops'] ? 'Дёшевый тариф' : 'Дорогой тариф'; ?></h2>
        <p>Количество пересадок: <?php echo $data['stops']; ?></p>
        <h2><?php echo $data['origin_name'] . ' - ' . $data['destination_name']; ?></h2>
        <div>
            <div>
                <p><?php echo $data['departure_time']; ?></p>
                <p><?php echo date('d F Y, D', strtotime($data['departure_date'])); ?></p>
                <p><?php echo $data['origin_name']; ?></p>
            </div>
            <div>
                <p><?php echo $data['arrival_time']; ?></p>
                <p><?php echo date('d F Y, D', strtotime($data['arrival_date'])); ?></p>
                <p><?php echo $data['destination_name']; ?></p>
            </div>
        </div>
        <h3><?php echo $data['price'] . ' ' . $signs[$currency - 1]; ?></h3>
        <form method="post">
            <label for="name">Имя:</label>
            <input type="text" id="name" name="name" required>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <button type="submit">Купить</button>
        </form>
    </div>
</body>
</html>