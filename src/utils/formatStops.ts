export function formatStops(stops:number) {
    if (stops === 0) {
      return "Без пересадок";
    }
  
    let ending = "";
    if (stops % 10 === 1) {
      ending = "пересадка";
    } else if (stops % 10 > 1 && stops % 10 < 5) {
      ending = "пересадки";
    } else {
      ending = "пересадок";
    }
  
    return `${stops} ${ending}`
  }
