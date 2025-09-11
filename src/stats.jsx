import React, { useState, useEffect } from 'react';
import {getStats}  from '../scripts/fetchStats';

const Stats = ({ userEmail }) => {
    const [stats, setStats] = useState({gamesPlayed: -1,
        averageGuesses: -1,
        totalUnderTen: -1,
        dailyStreak: -1,
        maxStreak: -1,
        total_guesses: -1,
        wins: -1
    });

    useEffect(() => {
        const fetchStats = async () => {
            const stats = await getStats(userEmail);
            setStats(stats);
        };
        fetchStats();

    }, [userEmail]);

    return (
        <div className='stats-box'>
            <div className ="stats-header">
                <h1>Stats for {userEmail}</h1>
            </div>

            <div className='stats'>
                <div className='statbox'>
                    <p>Games Played:</p>
                    <div className='stat'>
                        <p>{stats.gamesPlayed}</p>
                    </div>
                </div>
                <div className='statbox'>
                    <p>Wins:</p>
                    <div className='stat'>
                        <p>{stats.wins}</p>
                    </div>
                </div>
                <div className='statbox'>
                    <p>Total Guesses:</p>
                    <div className='stat'>
                        <p>{stats.total_guesses}</p>
                    </div>
                </div>

                <div className='statbox'>
                    <p>Average Guesses:</p>
                    <div className='stat'>
                        <p>{stats.gamesPlayed > 0 ? (stats.total_guesses / stats.gamesPlayed).toFixed(2) : 0}</p>
                    </div>
                </div>


                <div className='statbox'>
                    <p>Guesses Under 10:</p>
                    <div className='stat'>
                        <p>{stats.totalUnderTen}</p>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Stats;