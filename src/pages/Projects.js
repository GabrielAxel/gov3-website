import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import AlertModal from "../alert";

const project_list = [
    {
        "id": 1,
        "name": "Spacebudz",
        "icon": "https://i.imgur.com/WeamrJf.png",
        "type": "NFT",
        "proposal_number": 2,
        "vote_number": 14,
    },
    {
        "id": 2,
        "name": "Minswap",
        "icon": "https://s2.coinmarketcap.com/static/img/coins/200x200/12787.png",
        "type": "DeFi",
        "proposal_number": 3,
        "vote_number": 25,
    },
]

export default function Projects() {
    const [alertInformation, setAlertInformation] = useState({
        content: "",
        isDisplayed: false,
        type: "information",
    });

    return (
        <div className="min-h-screen bg-cover bg-[url('./images/background.svg')]">
            <p className='pt-5 ml-10 text-left text-3xl font-bold'>
                Projects
            </p>
            <Project projects={project_list}/>
            {alertInformation.isDisplayed && (
                <AlertModal
                type={alertInformation.type}
                animateNumber={alertInformation.animateNumber}
                bgNumber={alertInformation.bgNumber}
                onClose={() =>
                    setAlertInformation({
                    type: "information",
                    isDisplayed: false,
                    content: null,
                    })
                }
                >
                {alertInformation.content}
                </AlertModal>
            )}
        </div>
    );
}

function Project(props) {
    return (
        <div className='p-5 flex flex-wrap justify-center'>
            {props.projects?
                props.projects.map((project) => {
                    return (
                        <Link className='justify-center hover:brightness-125 w-60 h-auto border-black border-r-4 border-b-4 border-2 m-2 rounded-lg'
                            to={`/proposals/${project.id}`}>
                            <div className='flex flex-col'>
                                <img className='mt-2 m-auto w-20 h-20' src={project.icon}/>
                                <p className='mt-2 text-center text-xl font-bold text-black'>
                                    {project.name}
                                </p>
                                <div className='mt-2 m-2 flex flex-row'>
                                    <div className='w-1/2 flex flex-col'>
                                        <p className='text-center text-left text-[10px] text-black'>
                                            Proposals
                                        </p>
                                        <p className='mt-2 text-center text-left text-base font-semibold text-black'>
                                            {project.proposal_number}
                                        </p>
                                    </div>
                                    <div className='w-1/2 flex flex-col justify-center'>
                                        <p className='text-center text-left text-[10px] text-black'>
                                            Votes
                                        </p>
                                        <p className='mt-2 text-center text-left text-base font-semibold text-black'>
                                            {project.vote_number}
                                        </p>
                                    </div>
                                </div>
                                <div className='m-auto my-2 w-20 flex rounded-lg h-6 bg-emerald-600'>
                                    <p className='m-auto text-xs text-white'>
                                        {project.type}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                    
                })
                :""
            }
        </div>

    );
}