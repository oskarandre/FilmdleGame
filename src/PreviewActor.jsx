import React, { useEffect, useState } from 'react';
import { fetchPerson } from './lib/tmdb.js';

export const PreviewActor = ({ actor_id }) => {
    const [actorInfo, setActorInfo] = useState(null);

    useEffect(() => {
        const fetchActor = async () => {
            try {
                const information = await fetchPerson(actor_id);
                setActorInfo(information);
            } catch (error) {
                console.error("Failed to fetch actor data:", error);
            }
        };

        fetchActor();
    }, [actor_id]);

    if (!actorInfo) {
        return <div>Loading actor info...</div>;
    }

    return (
        <div className="actor_info" >
            <img src={`https://image.tmdb.org/t/p/w500${actorInfo.profile_path}`} alt={actorInfo.name} className='actor-image'/>
        </div>
    );
}

