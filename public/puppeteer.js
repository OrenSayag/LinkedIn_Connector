const puppeteer = require("puppeteer");


// This is where we'll put the code to get around the tests.
const preparePageForTests = async (page) => {
  // Pass the User-Agent Test.
  const userAgent =
    "Mozilla/5.0 (X11; Linux x86_64)" +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36";
  await page.setUserAgent(userAgent);
};

const theSocialButterfly = async (mailOrPhone, password, keyword) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const pagesToSweep = 20

  await preparePageForTests(page)
  await page.goto(
    "https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin"
  );

  await page.waitForSelector("#username");

  // prompt input values
  await page.$eval('#username', (el, mailOrPhone) => el.value = mailOrPhone, mailOrPhone);
  await page.$eval('#password', (el, password) => el.value = password, password);
  
  
  await Promise.all([
      page.click('.login__form_action_container>button'),
      page.waitForNavigation(),
  ]);

  // prompt input values
  await page.$eval('input.search-global-typeahead__input', (el, keyword) => el.value = keyword, keyword);

  await page.click(".search-global-typeahead")

  await page.keyboard.press("Enter")

  await page.waitForSelector("#search-reusables__filters-bar>ul>li:nth-child(1)>button")

  await page.click("#search-reusables__filters-bar>ul>li:nth-child(1)>button")


  

  await page.waitForSelector(".entity-result__actions")


//   const peopleContainers = await page.$(".entity-result__actions")
const connectionBtns = await page.evaluate(()=>{
    return document.querySelectorAll(".entity-result__actions>div>button")
})


await page.click(".entity-result__actions>div>button")

const pageRunner = async () => {
    for (const container of await page.$$(".entity-result__actions")) {
        for (const button of await container.$$("button")) {
            await button.click()
    
            await page.waitForSelector("button[aria-label='Send now']", {timeout: 1000}).catch(()=>{console.log("no popup")})
            if(await page.$("button[aria-label='Send now']") !== null){
                console.log("connect avaiable")
                
                // if upon clicking the send now btn we get the error
                // of limit reached, exit with a message
                await page.click("button[aria-label='Send now']")
                
                await page.waitForSelector("#ip-fuse-limit-alert__header", {timeout: 1000}).catch(()=>{})
    
                if(await page.$("#ip-fuse-limit-alert__header")!==null){
                    console.log("Connection request limit reached for this week")
                    await page.click("button[aria-label='Got it'")
                    // process.exit(1)
                }
                // else{

                //     await page.click("button[aria-label='Dismiss']")
                // }
            }
        }
    }
    return new Promise (resolve=>resolve(""))
}


for (let index = 1; index <= pagesToSweep; index++) {
    await pageRunner()
    await page.waitForSelector(`button[aria-label='Page ${index}']`, {timeout: 4000}).catch(()=>{})
    // await page.click(`button[aria-label='Page ${index}']`)
    await Promise.all([
        page.click(`button[aria-label='Page ${index+1}']`),
        new Promise(res=>setTimeout(() => {
            res("")
        }, 2000)
        )
    ]);
    console.log(`Moving to page ${index+1}`)
}
  

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("");
    }, 500000);
  });

  await browser.close();
}

module.exports = {
    theSocialButterfly
}
