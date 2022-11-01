const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false
        });
        const page = await browser.newPage();
        page.on('load', () => console.log('Page loaded!: ' + page.url()));
        await page.goto('https://www.sofascore.com/', {
            waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
        });

        await page.click('.slider')

        await page.waitForSelector('.sc-eDWCr.fvgWCd')
        await page.waitForSelector('.sc-hLBbgP.sc-eDvSVe.gjJmZQ.fRddxb')
       

        data = await page.evaluate(() => {
            teams = Array.from(document.querySelectorAll('.sc-hLBbgP.eIlfTT'))
            homeTeamss = teams.map(team => team.querySelectorAll('div')[0].innerText)
            awayTeamss = teams.map(team => team.querySelectorAll('div')[1].innerText)
            odds = Array.from(document.querySelectorAll('.sc-hLBbgP.sc-eDvSVe.gjJmZQ.fRddxb'))
            homeOdds = odds.map(odd => Array.from(odd.querySelectorAll('.sc-eDWCr.fvgWCd')).length > 0  ? odd.querySelectorAll('.sc-eDWCr.fvgWCd')[0].innerText : '').filter(odd => odd != '')
            awayOdds = odds.map(odd => Array.from(odd.querySelectorAll('.sc-eDWCr.fvgWCd')).length > 0  ? odd.querySelectorAll('.sc-eDWCr.fvgWCd')[2].innerText : '').filter(odd => odd != '')

            let games = [];
            for(let i = 0; i < homeTeamss.length; i++) {
                games.push({
                    homeTeam: homeTeamss[i],
                    homeTeamOdds: homeOdds[i],
                    awayTeam: awayTeamss[i],
                    awayTeamOdds: awayOdds[i]
                })
            }
           
            return games;
        });
        console.log(data);
        // other actions...
        // await browser.close();

    } catch (error) {

    }

})();


// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto("https://en.wikipedia.org/wiki/Web_scraping");

//     headings = await page.evaluate(() => {
//       headings_elements = document.querySelectorAll("h2 .mw-headline");
//       headings_array = Array.from(headings_elements);
//       return headings_array.map(heading => heading.textContent);
//     });
//     console.log(headings);
//     await browser.close();
//   })();

//   https://api.sofascore.com/api/v1/event/10433875
// api com dados de determinado evento

// page.on('load', () => console.log('Page loaded!: ' + page.url()));
// await page.goto(url, {
//         waitUntil: ['load','domcontentloaded','networkidle0','networkidle2']
//     });


// const puppeteer = require("puppeteer");
// (async () => {
//   let url = "https://www.airbnb.com/s/homes?refinement_paths%5B%5D=%2Fhomes&search_type=section_navigation&property_type_id%5B%5D=8";
//   const browser = await puppeteer.launch(url);
//   const page = await browser.newPage();
//   await page.goto(url);
//   data = await page.evaluate(() => {
//     root = Array.from(document.querySelectorAll("#FMP-target [itemprop='itemListElement']"));
//     hotels = root.map(hotel => ({
//       Name: hotel.querySelector('ol').parentElement.nextElementSibling.textContent,
//       Photo: hotel.querySelector("img").getAttribute("src")
//     }));
//     return hotels;
//   });
//   console.log(data);
//   await browser.close();
// })();

// classe dos jogos 
// sc-hLBbgP sc-eDvSVe gjJmZQ fRddxb