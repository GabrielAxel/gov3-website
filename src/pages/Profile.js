import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";

import Select from 'react-select';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import AlertModal from "../alert";
import MultipleWalletApi, { Cardano } from '../nami-js';

import moneyIcon from '../images/other_icon/money.svg';

let walletApi;

export default function Profile() {
    // const [address, setAddress] = useState();
    const [displayName, setDisplayName] = useState();
    const [about, setAbout] = useState();
    const [userData, setUserData] = useState();
    const [delationData, setDelationData] = useState();
    const [tokenList, setTokenList] = useState();
    const [project, setProject] = useState();
    const [presentation, setPresentation] = useState();

    const [localStorageChange, setLocalStorageChange] = useState(false);
    
    const [alertInformation, setAlertInformation] = useState({
        content: "",
        isDisplayed: false,
        type: "information",
    });
    async function init_wallet() {
        console.log('init wallet')
        try {
            const walletName = localStorage.getItem('wallet');
            if (walletName) {
                const S = await Cardano();
                walletApi = new MultipleWalletApi(
                    S,
                    window.cardano[walletName],
                    // blockfrostApiKey
                    {
                        0: "testneteDgsi4q4d7ZvI0StUUUT6UK5DazZeyQw", // testnet
                        1: "mainnetzPROg9q7idoA9ssVcWQMPtnawNVx0C0K", // mainnet
                    }
                );
                // setAddress(await walletApi.getAddress());

                getDelationData();
                getUserData();
            }
        }
        catch (e) {
            console.log(e)
            if (e.info) e = e.info;
            setAlertInformation({
                type: "information",
                isDisplayed: true,
                content: `${e}`,
            });
            localStorage.setItem('wallet', '');
            setUserAdaDisplay('');
        }
    }

    useEffect(() => {
        window.addEventListener('storage', () => {
            // console.log("change to local storage!");
            setLocalStorageChange(!localStorageChange);
        })
        init_wallet();
        getTokenList();

    }, [localStorageChange])

    async function getTokenList() {
        try {
            setAlertInformation({
                type: "loading",
                isDisplayed: true,
                content: null,
            });
            const response = await (await fetch(
                // 'http://localhost:8787/gov3/GetTokenList',
                'https://api.aidev-cardano.com/gov3/GetTokenList'
            )).json();
            setTokenList(response);

            setAlertInformation({
                type: "loading",
                isDisplayed: false,
                content: null,
            });
        }
        catch (e) {
            console.log(e)
            setAlertInformation({
                type: "information",
                isDisplayed: true,
                content: `${e}`,
            });
        }
    }
    async function getUserData () {
        try {
            if (!walletApi) return;

            setAlertInformation({
                type: "loading",
                isDisplayed: true,
                content: null,
            });

            const userAddress = await walletApi.getAddress();
            const response = await (await fetch(
                // `http://localhost:8787/gov3/User/${userAddress}`,
                `https://api.aidev-cardano.com/gov3/User/${userAddress}`,
            )).json();

            if (response.error) {
                setUserData();
                console.log(response);
            }
            else {
                setUserData(response);
            }
            setAlertInformation({
                type: "loading",
                isDisplayed: false,
                content: null,
            });
        }
        catch (e) {
            console.log(e)
            setAlertInformation({
                type: "information",
                isDisplayed: true,
                content: `${e}`,
            });
        } 
    }
    async function getDelationData () {
        try {
            if (!walletApi) return;

            setAlertInformation({
                type: "loading",
                isDisplayed: true,
                content: null,
            });

            const userAddress = await walletApi.getAddress();
            const response = await (await fetch(
                // `http://localhost:8787/gov3/Delegation/User/${userAddress}`,
                `https://api.aidev-cardano.com/gov3/Delegation/User/${userAddress}`,
            )).json();

            if (response.error) {
                setDelationData();
                console.log(response);
            }
            else {
                setDelationData(response);
            }
            setAlertInformation({
                type: "loading",
                isDisplayed: false,
                content: null,
            });
        }
        catch (e) {
            console.log(e)
            setAlertInformation({
                type: "information",
                isDisplayed: true,
                content: `${e}`,
            });
        } 
    }
    async function saveProfile() {
        try {
            setAlertInformation({
                type: "loading",
                isDisplayed: true,
                content: null,
            });
            if (!walletApi) {
                setAlertInformation({
                    type: "information",
                    isDisplayed: true,
                    content: `Connect your wallet first`,
                });
                return;
            }
            if (!displayName || !about) {
                setAlertInformation({
                    type: "information",
                    isDisplayed: true,
                    content: `Fill the form first`,
                });
                return;
            }

            const address = await walletApi.getAddress();
            const body = {
                'address': address,
                'display_name': displayName,
                'about': about,
            }
            const data = await (await fetch(
                // 'http://localhost:8787/gov3/EditUser',
                'https://api.aidev-cardano.com/gov3/EditUser',
                {
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                }
            )).json();
    
            if (data.error) {
                console.log(data.error);
                setAlertInformation({
                    type: "information",
                    isDisplayed: true,
                    content: `${data.error}`,
                });
                return;
            }
            setAlertInformation({
                type: "information",
                isDisplayed: true,
                content: `${data.message}`,
            });
        }
        catch (e) {
            console.log(e)
            setAlertInformation({
                type: "information",
                isDisplayed: true,
                content: `${e}`,
            });
        }
    }

    async function saveDelegation() {
        try {
            setAlertInformation({
                type: "loading",
                isDisplayed: true,
                content: null,
            });
            if (!walletApi) {
                setAlertInformation({
                    type: "information",
                    isDisplayed: true,
                    content: `Connect your wallet first`,
                });
                return;
            }
            if (!project || !presentation) {
                setAlertInformation({
                    type: "information",
                    isDisplayed: true,
                    content: `Fill the form first`,
                });
                return;
            }

            const address = await walletApi.getAddress();
            const body = {
                'address': address,
                'project': project,
                'presentation': presentation,
            }
            const data = await (await fetch(
                // 'http://localhost:8787/gov3/Delegation/EditUser',
                'https://api.aidev-cardano.com/gov3/Delegation/EditUser',
                {
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                }
            )).json();
    
            if (data.error) {
                console.log(data.error);
                setAlertInformation({
                    type: "information",
                    isDisplayed: true,
                    content: `${data.error}`,
                });
                return;
            }
            setAlertInformation({
                type: "information",
                isDisplayed: true,
                content: `${data.message}`,
            });
        }
        catch (e) {
            console.log(e)
            setAlertInformation({
                type: "information",
                isDisplayed: true,
                content: `${e}`,
            });
        }
    }
    return (
        <div className="min-h-screen bg-cover bg-[url('./images/background.svg')]">
            <div className='p-5'></div>

            <Tabs className='flex flex-col justify-center '>
                <TabList className='w-full flex flex-row border-black border-b-[1px] justify-center'>
                    <Tab>Edit Profile</Tab>
                    <Tab>Delegation Setting</Tab>
                </TabList>
                {/* Profile */}
                <TabPanel>
                    <div className='mt-5 m-auto flex flex-col rounded-lg border-2 border-b-4 border-r-4 border-black w-5/6 md:w-3/5 h-auto'>
                        <div className='m-5 flex flex-row justify-center'>
                            <img className='w-6' src={moneyIcon}/>
                            <p className='ml-2 text-black text-xl'>
                                Profile
                            </p>
                        </div>
                        <div className='flex flex-col m-auto w-5/6'>
                            <div className='flex flex-col w-full justify-center'>
                                <p className='mt-5 text-left text-black text-xl'>
                                    Display Name
                                </p>
                                <input type="text" placeholder='Display name'
                                    className='w-full rounded-lg border-2 border-black mx-auto text-xl h-10 text-center' required 
                                    defaultValue={userData? userData.display_name: ""}
                                    onChange={(event) => {
                                        setDisplayName(event.target.value);
                                    }}
                                />
                            </div>
                            <div className='flex flex-col w-full justify-center'>
                                <p className='mt-5 text-left text-black text-xl'>
                                    About
                                </p>
                                <textarea type="text" placeholder='About you'
                                    className='w-full rounded-lg border-2 border-black text-xl h-40' required 
                                    defaultValue={userData? userData.about: ""}
                                    onChange={(event) => {
                                        setAbout(event.target.value);
                                        // console.log(event.target.value)
                                    }}
                                />
                            </div>
                            {/* <div className='flex flex-col w-full justify-center'>
                                <p className='mt-5 text-left text-black text-xl'>
                                    Twitter
                                </p>
                                <input type="text" placeholder='handle'
                                    className='w-full rounded-lg border-2 border-black mx-auto text-xl h-10 text-center' required 
                                    onChange={(event) => {
                                        setTwitterName(event.target.value);
                                    }}
                                />
                            </div> */}
                            <button onClick={saveProfile} className='mt-10 mb-5 m-auto bg-[#FF9C84] border-2 border-black rounded-lg w-32 h-10 text-white'>
                                Save
                            </button>
                        </div>
                    </div>
                </TabPanel>

                {/* Delegation */}
                <TabPanel>
                    <div className='mt-5 m-auto flex flex-col rounded-lg border-2 border-b-4 border-r-4 border-black w-5/6 md:w-3/5 h-auto'>
                        <div className='m-5 flex flex-col justify-center'>
                            <p className='ml-2 text-black text-xl'>
                                Delegation
                            </p>
                            <p className='ml-2 text-gray-400 text-sm'>
                                If you'd like to represent voters on their behalf, you may opt-in to become a delegate. You can also choose to delegate to yourself on any project.
                            </p>
                        </div>
                        <div className='flex flex-col m-auto w-5/6'>
                            <div className='flex flex-col w-full justify-center'>
                                <p className='mt-5 text-left text-black text-xl'>
                                    Project
                                </p>
                                {tokenList
                                    ?   <Select
                                            className="w-full"
                                            styles={customStyles}
                                            placeholder={"Select"}
                                            onChange={(event) => {
                                                setProject(event.value);
                                            }}
                                            options={tokenListOption(tokenList)}
                                        />
                                    :""
                                }
                            </div>
                            <div className='flex flex-col w-full justify-center'>
                                <p className='mt-5 text-left text-black text-xl'>
                                    Delegation presentation
                                </p>
                                <p className='text-left text-gray-400 text-sm'>
                                    Help voters understand why they should delegate their votes to you.
                                </p>

                                <textarea type="text"
                                    className='w-full rounded-lg border-2 border-black text-xl h-40' required 
                                    defaultValue={delationData?findDelegationPresentation(delationData, project):""}
                                    onChange={(event) => {
                                        setPresentation(event.target.value);
                                    }}
                                />
                            </div>
                            <button onClick={saveDelegation} className='mt-10 mb-5 m-auto bg-[#FF9C84] border-2 border-black rounded-lg w-32 h-10 text-white'>
                                Save
                            </button>
                        </div>
                    </div>
                </TabPanel>

            </Tabs>


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

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        color: '#008BF0',
        border: '2px solid #000000',
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? '#008BF0' : 'black',
        backgroundColor: 'white',
        borderRadius: '1rem',
        margin: 'auto',
        // flexDirection: 'row',
        // display: 'flex',
        '&:hover': {
            backgroundColor: '#008BF0',
            color: 'white',
        },
        textAlign: 'center',
        width: '100%',/* Need a specific value to work */
    }),
    dropdownIndicator: () => ({
        color: '#008BF0',
        width: '1.5rem',
    }),

    control: () => ({
        // none of react-select's styles are passed to <Control />
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        border: '2px solid #000000',
        margin: 'auto',
        flexDirection: 'row',
        display: 'flex',
    }),
    singleValue: () => ({
        color: '#000000',
        position: 'absolute',
        textAlign: 'center',
        width: '100%',/* Need a specific value to work */
    }),
    placeholder: () => ({
        color: '#000000',
        position: 'absolute',
        // left: '10px',
        textAlign: 'center',
        width: '100%',/* Need a specific value to work */
        fontSize: '1rem',
    })
}

function tokenListOption(tokenList) {
    let options = [];
    for (let data of tokenList) {
        options.push(
            {
                value: `${data.name}`,
                label: 
                <div className="justify-center flex flex-row justify-center">
                    <img className='w-8 h-8' src={data.image}/>
                    <p className='ml-2 text-xl'>${data.name}</p>
                </div>
            },
        )
    }
    return options
}

function findDelegationPresentation(delegationData, project) {
    for (let data of delegationData) {
        if (data.project === project) {
            return data.presentation;
        }
    }

    return '';
}