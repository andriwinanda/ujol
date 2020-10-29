export function urlEncoded(obj) {
  var str = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
      )
    }
  }
  return str.join("&");
}

export function capitalizeLetter(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Duration
export function durationMil(milisecs) {
  let secs = milisecs / 1000;
  var minutes = Math.floor(secs / 60);
  secs = secs % 60;
  var hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return `${
    hours ? (hours > 1 ? hours + " Hours " : hours + " Hour ") : ""
    }${
    minutes
      ? minutes > 1
        ? minutes + " Minutes "
        : minutes + " Minute "
      : ""
    }${secs ? (secs > 1 ? secs + " Seconds " : secs + " Second ") : ""}`;
  // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
}

