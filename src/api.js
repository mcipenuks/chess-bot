const axios = require('axios');
const {TimeControl, ChessProfile} = require('./bot');

const BASE_URL = 'https://api.chess.com/pub';
const DEFAULT_AVATAR = 'https://betacssjs.chesscomfiles.com/bundles/web/images/noavatar_l.84a92436.gif';

const fetchPlayer = async (username) => {
    const res = (await axios.get(BASE_URL + `/player/${username}`)).data;
    return {
        username: res.url.replace('https://www.chess.com/member/', '').trim(),
        name: res.name ? res.name : null,
        country: res.country ? res.country.slice(34).toLowerCase() : null,
        avatar: res.avatar ? res.avatar : DEFAULT_AVATAR,
        title: res.title ? res.title : null,
        lastOnline: res.last_online
    }

}

const fetchStats = async (username) => {
    const res = (await axios.get(BASE_URL + `/player/${username}/stats`)).data;
    return {
        stats: mapStats(res),
        fide: res.fide ? res.fide : null
    }
}


const getProfile = async (username) => {
    const player = await fetchPlayer(username);
    const stats = await fetchStats(username);

    return new ChessProfile({
        stats: stats.stats,
        username: player.username,
        name: player.name,
        country: player.country,
        avatar: player.avatar,
        title: player.title,
        fide: stats.fide,
        lastOnline: player.lastOnline
    });
}

const mapStats = (stats) => {
    const timeControls = ['chess_bullet', 'chess_blitz', 'chess_rapid'];
    return timeControls.map(t => {
        const name = t.substr(6);

        if (!stats[t]) return new TimeControl({name});
        return new TimeControl({
            name,
            rating: stats[t].last.rating,
            highestRating: stats[t].best ? stats[t].best.rating : stats[t].last.rating,
            winCount: stats[t].record.win,
            lossCount: stats[t].record.loss,
            drawCount: stats[t].record.draw
        })
    });
}

module.exports = {
    getProfile
}