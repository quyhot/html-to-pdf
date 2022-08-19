const puppeteer = require('puppeteer')
const fsNode = require("fs-extra");
const hbs = require("handlebars");
const path = require("path");
const fs = require("fs")

const data = {
    image: {
        "logo": `data:image/png;base64,${base64_encode('./templates/logo.png')}`,
        "test": `data:image/png;base64,${base64_encode('./templates/test.png')}`,
        "car1": `data:image/png;base64,${base64_encode('./templates/car1.png')}`,
        "car2": `data:image/png;base64,${base64_encode('./templates/car2.png')}`,
        "check": `data:image/png;base64,${base64_encode('./templates/check.png')}`
    }
}

const compile = async function (templateName, data) {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    const html = await fsNode.readFile(filePath, 'utf8');
    console.log(html)
    return hbs.compile(html)(data);
};

function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
    })

    const page = await browser.newPage()

    const html = await compile('index', data)
    await page.setContent(html, {
        waitUntil: 'networkidle0',
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
    })

    await page.pdf({
        format: 'A4',
        path: `my-fance-invoice.pdf`,
        printBackground: true,
        scale: 0.5,
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
        },
    })

    // close the browser
    await browser.close()
})()

