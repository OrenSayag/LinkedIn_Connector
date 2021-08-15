const puppeteer = require("puppeteer");
const EventEmitter = require("events");
const messageToClient = new EventEmitter();
let exPath=`C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`

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
  const pagesToSweep = 20;

  await preparePageForTests(page);
  await page.goto(
    "https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin"
  );

  await page.waitForSelector("#username");

  // prompt input values
  await page.$eval(
    "#username",
    (el, mailOrPhone) => (el.value = mailOrPhone),
    mailOrPhone
  );
  await page.$eval(
    "#password",
    (el, password) => (el.value = password),
    password
  );

  messageToClient.emit("message", "logging in");

  await page.waitForSelector(".login__form_action_container>button");
  await page.click(".login__form_action_container>button");
  await page.waitForNavigation();

  await page
    .waitForSelector("input.search-global-typeahead__input", { timeout: 5000 })

    .catch(async () => {
      if (await page.$("form.country-code-list-form" !== null)) {
        await page.waitForSelector("button.secondary-action");
        await page.click("button.secondary-action");
      } else {
        messageToClient.emit(
          "message",
          "LinkedIn is requiring human verification. Please help the program"
        );
        
      }
    });

  await page.waitForSelector("input.search-global-typeahead__input", {timeout: 150000})
  .catch(()=>{
    messageToClient.emit("message", "Connection timed out, or the browser was closed. Try again")
    browser.close()
    // messageToClient.emit("restart", "")
    

  })
  ;

  await page.$eval(
    "input.search-global-typeahead__input",
    (el, keyword) => (el.value = keyword),
    keyword
  );

  await page.click(".search-global-typeahead");

  await page.keyboard.press("Enter");

  messageToClient.emit("message", "searching");

  await page.waitForSelector(
    "#search-reusables__filters-bar>ul>li:nth-child(1)>button"
  );

  await page.click("#search-reusables__filters-bar>ul>li:nth-child(1)>button");

  await page
    .waitForSelector(".entity-result__actions>div>button", { timeout: 10000 })
    .catch(() => {
      messageToClient.emit("message", "No search results. It's either a technical problem or your linkedin network is too small to enable search result connection");
      // console.log(
      //   "No search results. It's either a technical problem or your linkedin network is too small to enable search result connection"
      // );
      // process.exit(1)
      browser.close()
    // messageToClient.emit("restart", "")
      // browser.close();
    });

  // await page.click(".entity-result__actions>div>button")

  const pageRunner = async () => {
    for (const container of await page.$$(".entity-result__actions")) {
      for (const button of await container.$$("button")) {
        const text = await page.evaluate((el) => el.textContent, button);
        // console.log(text)
        if (
          text.includes("Connect") ||
          (text.includes("Follow") && !text.includes("Following"))
        ) {
          await button.click();

          let person = await page.$("strong");
          person = await page.evaluate((el) => el.textContent, person);

          messageToClient.emit(
            "message",
            "sending connect request to " + person
          );

          messageToClient.emit("countup", "countup")


          //someimtes linkedin blocks the popup
          await page
            .waitForSelector("button[aria-label='Send now']", { timeout: 1000 })
            .catch(() => {
              console.log("no popup");
            });
          if ((await page.$("button[aria-label='Send now']")) !== null) {
            await page
              .waitForSelector("button[aria-label='Send now']")
              .catch(() => {
                messageToClient.emit(
                  "message",
                  "antibot blocked this connection - moving to the next one."
                );
              });
            await page.click("button[aria-label='Send now']").catch(() => {
              messageToClient.emit(
                "message",
                "antibot blocked this connection - moving to the next one."
              );
            });
          }

          //   .then(async () => {
          //   })
          //   .catch(() => {
          //     console.log("No send now button");
          //   });

          await page
            .waitForSelector("#ip-fuse-limit-alert__header", {
              timeout: 2000,
            })
            .catch(() => {
              console.log(
                "No alert was fired - seems like linkedin is blocking it"
              );
              messageToClient.emit("message", "antibot");
            });

          if ((await page.$("#ip-fuse-limit-alert__header")) !== null) {
            messageToClient.emit("message", "You reached your connection limit for this week. LinkedIn limits connection requests to 70 per week.");
            // console.log(
            //   "Connection request limit reached for this week. Closing browser, displaying message"
            // );
            // process.exit(1)
            browser.close();

            await page.click("button[aria-label='Got it'").catch(() => {});
          } else {
            await page.click("button[aria-label='Dismiss']").catch(()=>{console.log("Something went wrong with clicking the dismiss btn")})
            // send connection count
          }
        }
      }
    }
    return new Promise((resolve) => resolve(""));
  };

  for (let index = 1; index <= pagesToSweep; index++) {
    await pageRunner();
    await page.evaluate(() => new Promise((resolve) => {
      var scrollTop = -1;
      const interval = setInterval(() => {
        window.scrollBy(0, 100);
        if(document.documentElement.scrollTop !== scrollTop) {
          scrollTop = document.documentElement.scrollTop;
          return;
        }
        clearInterval(interval);
        resolve();
      }, 10);
    }));
    await page
      .waitForSelector(`button[aria-label='Page ${index + 1}']`, { timeout: 12_000 })
      .catch(() => {
        messageToClient.emit(
          "message",
          "Something went wrong."
        );
        browser.close();
      });
      // await page.click(`button[aria-label='Page ${index}']`)
      await page.click(`button[aria-label='Page ${index + 1}']`);
      messageToClient.emit(
        "message",
        `Moving to page ${index + 1}`
      );
    await new Promise((res) =>
      setTimeout(() => {
        res("");
      }, 2000)
    );
    // console.log(`Moving to page ${index + 1}`);
  }

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("");
    }, 500000);
  });

  await browser.close();
};

module.exports = {
  theSocialButterfly,
  messageToClient,
};
