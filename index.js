const puppeteer = require('puppeteer');
const fs = require('fs');

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

        await page.setViewport({
            width: 1200,
            height: 926 //para pegar mais jogos, aumentar a altura do viewport para o tamanho total da tela aprox. 7000
        });

        await page.click('.slider')

        await page.waitForSelector('.sc-eDWCr.fvgWCd')
        await page.waitForSelector('.sc-hLBbgP.sc-eDvSVe.gjJmZQ.fRddxb')

        data = await page.evaluate(extractGames);

        const dataFormated = await transforData(data);
        const gamesFiltered = await filterByAwayTeamOdd(dataFormated);
        await saveJson(gamesFiltered);
        // other actions...
        await browser.close();

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

async function saveJson(dataFormated) {
    try {
        fs.writeFileSync('games.json', JSON.stringify(dataFormated));
    } catch (error) {
        console.log(error)
    }
}

async function filterByAwayTeamOdd(games) {
    return games.filter(game => game.awayTeamOdds > 4.5 && game.awayTeamOdds < 10);
}

function extractGames() {
    teams = Array.from(document.querySelectorAll('.sc-hLBbgP.eIlfTT'))
    homeTeamss = teams.map(team => team.querySelectorAll('div')[0].innerText)
    awayTeamss = teams.map(team => team.querySelectorAll('div')[1].innerText)
    odds = Array.from(document.querySelectorAll('.sc-hLBbgP.sc-eDvSVe.gjJmZQ.fRddxb'))
    homeOdds = odds.map(odd => Array.from(odd.querySelectorAll('.sc-eDWCr.fvgWCd')).length > 0 ? odd.querySelectorAll('.sc-eDWCr.fvgWCd')[0].innerText : '').filter(odd => odd != '')
    awayOdds = odds.map(odd => Array.from(odd.querySelectorAll('.sc-eDWCr.fvgWCd')).length > 0 ? odd.querySelectorAll('.sc-eDWCr.fvgWCd')[2].innerText : '').filter(odd => odd != '')

    let games = [];
    for (let i = 0; i < homeTeamss.length; i++) {
        games.push({
            homeTeam: homeTeamss[i],
            homeTeamOdds: homeOdds[i],
            awayTeam: awayTeamss[i],
            awayTeamOdds: awayOdds[i]
        })
    }

    return games;
}