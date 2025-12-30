// import http from "http";
// import https from "https";

export class FetchJson {
  /**
   * @param {string} url 
   * @param {object} headers
   * @returns 
   */
  async execute(url, headers = {}) {
    for (const [key, value] of Object.entries(headers)) {
      console.log(` > with header => ${key}: ${value.substring(0, 16)}...`);
    }
    const res = await fetch(url, { headers });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }

    return res.json();
  }

  // /**
  //  * @param {string} url 
  //  */
  // async legacy(url) {
  //   const lib = url.startsWith("https") ? https : http;

  //   return new Promise((resolve, reject) => {
  //     lib.get(url, res => {
  //       let data = "";

  //       if (res.statusCode < 200 || res.statusCode >= 300) {
  //         reject(new Error(`HTTP ${res.statusCode}`));
  //         return;
  //       }

  //       res.on("data", chunk => (data += chunk));
  //       res.on("end", () => {
  //         try {
  //           resolve(JSON.parse(data));
  //         } catch (err) {
  //           reject(err);
  //         }
  //       });
  //     }).on("error", reject);
  //   });
  // }

  /**
   * @param {string} value 
   */
  isURL(value) {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }
}