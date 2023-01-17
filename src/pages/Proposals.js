import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Routes, Route, useParams } from 'react-router-dom';

import AlertModal from "../alert";
import MultipleWalletApi, { Cardano } from '../nami-js/nami';
let walletApi;



export default function Proposals() {
    let { proposalId } = useParams();

    const [alertInformation, setAlertInformation] = useState({
        content: "",
        isDisplayed: false,
        type: "information",
    });

    return (
        <div className="min-h-screen bg-cover bg-[url('./images/background.svg')]">
            <div className='p-5'></div>

            <div className='flex flex-row'>
                <div className='flex flex-col w-2/3'>
                    <p className='ml-2 text-left text-2xl font-bold text-black'>
                        Proposals
                    </p>
                    <Proposal proposals={proposal_list}/>
                </div>
                <div className='w-1/3 flex flex-col'>
                    <div className='mt-10 shadow-xl bg-white m-auto w-11/12 mt-2 flex flex-col rounded-xl border-[1px] border-[#acacac]'>
                        <p className='text-xl text-center'>Voting Power</p>
                        <p className='my-5 text-xl text-center text-blue-400'>12</p>
                    </div>

                    <Link className='mt-2 rounded-[200px] flex m-auto w-11/12 h-12 shadow-sm shadow-indigo-500 text-[#522c99] text-2xl font-semibold bg-gradient-to-b from-[#DA8CFF] to-[#B8F2FA] hover:animate-pulse transition-all hover:bg-gradient-to-t hover:duration-1000'
                        to={`/create_proposal/${proposalId}`}
                    >
                        <p className='m-auto text-xs md:text-lg'>
                            Create Proposal
                        </p>
                    </Link>
                    
                </div>
            </div>


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

const proposal_list = [
    {
        "id": 1,
        "project_id": 1,
        "title": "Imporve NFT minting",
        "creator": "Jimmy",
        "end_time": 1673766842000,
        "status": "active"
    },
    {
        "id": 2,
        "project_id": 1,
        "title": "Art style improvement",
        "creator": "Eric",
        "end_time": 1673666842000,
        "status": "closed"
    },
]

function Proposal(props) {
    return (
        <div>
            {props.proposals?
                props.proposals.map((proposal) => {
                    return(
                        <Link className='shadow-xl bg-white m-auto w-11/12 mt-2 flex flex-col rounded-xl border-[1px] border-[#acacac] hover:brightness-125'
                            to={`/proposal/${proposal.id}`}
                        >
                            {/* <div className='my-3 w-full border-[1px] border-[acacac]'></div> */}
                            <div className='m-auto flex flex-row'>
                                <p className='text-black text-base'>by</p>
                                <p className='ml-2 text-blue-600 text-base'>{proposal.creator}</p>

                             
                                {(proposal.status==='active')
                                ?
                                    <p className='ml-2 text-black text-base'>
                                        End {time2TimeAgo(proposal.end_time)}
                                    </p>
                                :
                                    <p className='ml-2 text-black text-base'>
                                        Ended {time2TimeAgo(proposal.end_time)}
                                    </p>
                                }


                            </div>

                            <div className='m-auto flex flex-row justify-between'>
                                {(proposal.status==='active')
                                ?
                                    <p className='text-l sm:text-xl text-green-400 font-bold sm:font-extrabold'>
                                        {`[${proposal.status}]`}
                                    </p>
                                :
                                    <p className='text-l sm:text-xl text-red-400 font-bold sm:font-extrabold'>
                                        {`[${proposal.status}]`}
                                    </p>
                                }

                                <p className='ml-2 text-l sm:text-xl text-black font-bold sm:font-extrabold'>
                                    {proposal.title}
                                </p>
                                {/* <p className='m-5 text-md text-[#004D65]'>
                                    {`${data.hold} NFTs / ${(balance.ada * data.hold * data.weight).toFixed(0)} XP per epoch`}
                                </p> */}

                            </div>
                        </Link>
                    )
                })
                :""
            }
        </div>

    );
}


function time2TimeAgo(ts) {
    // This function computes the delta between the
    // provided timestamp and the current time, then test
    // the delta for predefined ranges.

    var d=new Date();  // Gets the current time
    var nowTs = Math.floor(d.getTime()); // getTime() returns milliseconds, and we need seconds, hence the Math.floor and division by 1000
    var seconds = (nowTs - ts) / 1000;

    if (seconds > 0) {
        // more that two days
        if (seconds > 2*24*3600) {
        //    return "a few days ago";
           return Math.floor(seconds/60/60/24) + " days ago";
        }
        // a day
        if (seconds > 24*3600) {
           return "yesterday";
        }
    
        if (seconds > 3600) {
           return Math.floor(seconds/60/60) + " hours ago";
        }
        if (seconds > 60) {
           return Math.floor(seconds/60) + " minutes ago";
        }
    
        if (seconds < 60) {
           return seconds + "seconds ago";
        }
    }
    else {
        seconds = -seconds;
        if (seconds > 2*24*3600) {
        //    return "a few days ago";
            return `in ${Math.floor(seconds/60/60/24)} days`;
        }
        // a day
        if (seconds > 24*3600) {
            return "yesterday";
        }
        if (seconds > 3600) {
            return `in ${Math.floor(seconds/60/60)} hours`;
        }
        if (seconds > 60) {
            return `in ${Math.floor(seconds/60)} minutes`;
        }
    
        if (seconds < 60) {
            return `in ${seconds} seconds`;
        }
    }


}
