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
        const dataFormated = await transforData(data);
        console.log(dataFormated);
        // other actions...
        // await browser.close();

    } catch (error) {

    }

})();

async function transforData(data) {
    return data.map(game => {
        let gameFormated = {}
        gameFormated.homeTeam = game.homeTeam;
        gameFormated.homeTeamOdds = parseFloat(game.homeTeamOdds);
        gameFormated.awayTeam = game.awayTeam;
        gameFormated.awayTeamOdds = parseFloat(game.awayTeamOdds);

        return gameFormated;
    })
}