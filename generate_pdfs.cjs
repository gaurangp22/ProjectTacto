const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Evaluate fonts and wait for network idle to ensure everything loads
    const options = { waitUntil: 'networkidle0', timeout: 30000 };
    
    let baseUrl = "http://localhost:8080";
    console.log("Checking port 8080...");
    try {
        const response = await page.goto(baseUrl + "/whitepaper", options);
        if (!response.ok()) throw new Error("Not OK");
    } catch(e) {
        console.log("Port 8080 failed, trying 5173...");
        baseUrl = "http://localhost:5173";
        await page.goto(baseUrl + "/whitepaper", options);
    }

    // Force wait a bit for Lucide icons and fonts
    await new Promise(r => setTimeout(r, 2000));

    console.log("Generating Whitepaper PDF...");
    await page.pdf({
        path: 'C:\\Users\\Acer\\Desktop\\ProjectTACTO\\TACTO_Whitepaper.pdf',
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    console.log("Generating Evaluation Metrics PDF...");
    await page.goto(baseUrl + "/evaluation-metrics", options);
    await new Promise(r => setTimeout(r, 2000));
    
    await page.pdf({
        path: 'C:\\Users\\Acer\\Desktop\\ProjectTACTO\\TACTO_Evaluation_Metrics.pdf',
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    console.log("Generating Scalability PDF...");
    await page.goto(baseUrl + "/scalability", options);
    await new Promise(r => setTimeout(r, 2000));
    
    await page.pdf({
        path: 'C:\\Users\\Acer\\Desktop\\ProjectTACTO\\TACTO_Scalability.pdf',
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    await browser.close();
    console.log("Done! PDFs saved to Desktop/ProjectTACTO.");
})();
