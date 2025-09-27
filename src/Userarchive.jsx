import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FetchUserGameData from './FetchUserGameData.jsx';
import findFinishedGames from '../scripts/findFinishedGames.js';
import findStartedGames from '../scripts/findStartedGames.js';


const Archive = ({ userEmail }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [finishedDates, setFinishedDates] = useState([]);
    const [giveUpDates, setGiveUpDates] = useState([]);
    const [startedDates, setStartedDates] = useState([]);

    const startDate = new Date("2024-07-19");
    const today = new Date();

    // Function to handle date selection when a card is clicked
    const handleClick = (date) => {
        setSelectedDate(date);
    };

    // Function to handle going back to the archive view
    const handleBackToArchive = () => {
        setSelectedDate(null);
        fetchGames(); // Fetch games again when going back to the archive view
    };

    // Calculate the number of days between startdate and today
    const numberOfDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));

    // Format date as "yyyy-mm-dd"
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // fetch finished and started games
    const fetchGames = async () => {
        const { finishedDates, giveUpDates } = await findFinishedGames(userEmail);
        setFinishedDates(finishedDates || []);
        setGiveUpDates(giveUpDates || []);

        const dates = await findStartedGames(userEmail);
        setStartedDates(dates || []);
    };

    useEffect(() => {
        fetchGames();
    }, [userEmail]);


    return (
        <div className='archive'>

            {!selectedDate ? (
                <div className='archive-view'>
                    <>
                        <motion.div 
                            className='archive-header'
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <h1>Archive</h1>
                        </motion.div>
                        <div className='archive-box'>
                            <div className='topper'>
                            </div>
                            <div className='old-games'>
                                {Array.from({ length: numberOfDays }, (_, index) => {
                                    const date = new Date(startDate);
                                    date.setDate(date.getDate() + index);
                                    return date;
                                }).reverse().map((date, index) => {
                                    const formattedDate = formatDate(date);
                                    // Determine the class based on priority: red -> green -> yellow
                                    let className = 'old-game';

                                    if (giveUpDates.includes(formattedDate)) {
                                        className += ' red';
                                    } else if (finishedDates.includes(formattedDate)) {
                                        className += ' green';
                                    } else if (startedDates.includes(formattedDate)) {
                                        className += ' yellow';
                                    }

                                    return (
                                        <div
                                            key={index}
                                            className={className}
                                            onClick={() => handleClick(date)}
                                        >
                                            <p>{date.toLocaleDateString()}</p>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </>
                </div>
            ) : (
                <div>
                    <button className="back-to-archive-btn" onClick={handleBackToArchive}>Back to Overview</button>
                    <FetchUserGameData userEmail={userEmail} date={formatDate(selectedDate)} />
                </div>
            )}
        </div>

    );
};

export default Archive;