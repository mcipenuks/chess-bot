const axios = require('axios');
const BASE_URL = 'https://chess.com/callback/member/stats/';

const fetchUser = async (name) => {
    let res = await axios.get(BASE_URL + name);
    return {
        stats: mapUserStats(res.data.stats),
        fide: res.data.officialRating ? res.data.officialRating.rating : null
    }
}

const mapUserStats = (stats) => {
    let usefulControls = ['lightning', 'bullet', 'rapid'];
    let timeControls = stats.filter(s => usefulControls.includes(s.key));

    return timeControls.map(t => {
        return new TimeControl({
            name: t.key,
            rating: t.stats.rating,
            highestRating: t.stats.highest_rating,
            gameCount: t.gameCount,
            winCount: t.stats.total_win_count,
            lossCount: t.stats.total_loss_count,
            drawCount: t.stats.total_draw_count
        })
    });
}

class TimeControl {
    constructor({
        name = '',
        rating = 0,
        highestRating = 0,
        gameCount = 0,
        winCount = 0,
        lossCount = 0,
        drawCount = 0
    } = {}) {
        this.name = name;
        this.rating = rating;
        this.highestRating = highestRating;
        this.gameCount = gameCount;
        this.winCount = winCount;
        this.lossCount = lossCount;
        this.drawCount = drawCount;
    }

}

class ChessProfile {
    constructor(stats, fide, name) {
        this.name = name;
        this.fide = fide;
        this.bullet = null;
        this.lightning = null;
        this.rapid = null;

        this.setTimeControls(stats);
    }

    setTimeControls(stats) {
        stats.forEach(s => {
            this[s.name] = s;
        });
    }

    getRatingString(control) {
        if (this[control] === null) return '—';
        return `Rating: ${this[control].rating} \n (W: ${this[control].winCount}/L: ${this[control].lossCount}/D: ${this[control].drawCount})`
    }
    getFideRating() {
        return this.fide ? `Rating: ${this.fide}` : '—';
    }
}

const run = async (name) => {
    let user = await fetchUser(name);
    return new ChessProfile(user.stats, user.fide, name);
}

module.exports = run;
