import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getStats } from '../scripts/fetchStats';
import AnimatedStat from './components/AnimatedStat';

const Stats = ({ userEmail }) => {
    const [stats, setStats] = useState({
        gamesPlayed: 0,
        averageGuesses: 0,
        totalUnderTen: 0,
        dailyStreak: 0,
        maxStreak: 0,
        total_guesses: 0,
        wins: 0
    });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            const fetchedStats = await getStats(userEmail);
            setStats(fetchedStats);
            setIsLoaded(true);
        };
        fetchStats();
    }, [userEmail]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: 50,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    return (
        <div className='stats'>
            <div className='stats-view'>
                <motion.div 
                    className='stats-header'
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1>Stats</h1>
                </motion.div>
                
                <motion.div 
                    className='stats-box'
                    variants={containerVariants}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                >
                    <div className='stats-grid'>
                        <motion.div variants={itemVariants}>
                            <AnimatedStat 
                                value={stats.gamesPlayed} 
                                label="Games Played" 
                                delay={0.1}
                                duration={1.5}
                            />
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <AnimatedStat 
                                value={stats.wins} 
                                label="Wins" 
                                delay={0.3}
                                duration={1.5}
                            />
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <AnimatedStat 
                                value={stats.total_guesses} 
                                label="Total Guesses" 
                                delay={0.5}
                                duration={1.5}
                            />
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <AnimatedStat 
                                value={stats.gamesPlayed > 0 ? parseFloat((stats.total_guesses / stats.gamesPlayed).toFixed(2)) : 0} 
                                label="Average Guesses" 
                                delay={0.7}
                                duration={1.5}
                            />
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <AnimatedStat 
                                value={stats.totalUnderTen} 
                                label="Guesses Under 10" 
                                delay={0.9}
                                duration={1.5}
                            />
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <AnimatedStat 
                                value={stats.dailyStreak} 
                                label="Current Streak" 
                                delay={1.1}
                                duration={1.5}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Stats;