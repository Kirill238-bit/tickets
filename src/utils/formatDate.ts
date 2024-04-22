export function formatDate(dateString:string) {
    const [day, month, year] = dateString.split(".");

    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    const dayOfWeek = date.toLocaleDateString("ru-RU", { weekday: "short" });

    const monthName = date.toLocaleDateString("ru-RU", { month: "long" });
  
    return `${day} ${monthName} 20${year}, ${dayOfWeek}`
  }