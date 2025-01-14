import React from 'react'
import {useState,useEffect,useMemo} from 'react'
import {ethers} from 'ethers'

import { useRouter } from 'next/router';
import UserOptions from './UserOptions';
import { InformationCircleIcon , SearchIcon , CheckIcon, PencilIcon } from '@heroicons/react/outline';

import { CodeContributorStats,OptionRepoOwner,CodeDurationStats } from '../../utils/contributorStats';

interface CreationDistributionProps {
    triggerToMain:number;
    setTriggerToMain:React.Dispatch<React.SetStateAction<number>>;
}

declare let window:any

const CreationDistribution: React.FC<CreationDistributionProps> = ({triggerToMain,setTriggerToMain}) => {
    const router = useRouter();

    const [DaoFees,setDaoFees] = useState('');
    const [distributionPercentage,setDistributionPercentage] = useState('');
    const [algorithm,setAlgorithm] = useState('');
    const [network,setNetwork] = useState('');
    const [errorMsg,setErrorMsg] = useState('');

    const [contributors,setContributors] = useState<any>([]);
    const [isLoading,setIsLoading]=useState(true);

    const [editDistribution,setEditDistribution] = useState(true);

    //search logic
    const [search, setSearch] = useState("");
    const [triggerSearch,setTriggerSearch] = useState(0);
    const contributorSearch = useMemo(() => {
        if (search==="") return contributors;
        setTriggerSearch(triggerSearch+1)
        return contributors.filter((_contributor:any) => {
            return (
                _contributor.author.login.toLowerCase().includes(search.toLowerCase()) ||
                _contributor.author.login === JSON.parse(localStorage.getItem('DaoCreationData')||'{}').repoFullName.split('/')[0]
            );
        });
    }, [search,contributors]);

    useEffect(()=>{
        const dataInStorage = JSON.parse(localStorage.getItem('DaoCreationData')||'{}');
        if (dataInStorage==='') return;
        const repoName = dataInStorage.repoFullName;
        if (repoName==='') return; 
        fetch(`/api/repo/contributors/${repoName}`)
        .then(res => res.json())
        .then(data => {
            setTriggerToMain(triggerToMain+1);
            setContributors(data);
            setIsLoading(false);
            const distributionInit:any = {}
            data.forEach((el:any) => {
                const contri = el.author.login
                distributionInit[`${contri}`] = '0%';
            })
            localStorage.setItem('distributionOk','true');
            const oldData = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')
            const newData = {...oldData,distribution:distributionInit}
            if(oldData.distribution===undefined){
                localStorage.setItem('DaoCreationData',JSON.stringify(newData));
            }
        }).catch(err => {
            console.log(err);
        })
    },[])

    const AlgoOwner =()=>{
        const oldData = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')
        const newData = OptionRepoOwner(oldData,contributors,distributionPercentage);
        oldData.distribution = newData;
        localStorage.setItem('DaoCreationData',JSON.stringify(oldData));
        setTriggerToMain(triggerToMain+1);
    } 

    const AlgoCode = ()=>{
        const oldData = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')
        const newData = CodeContributorStats(contributors,distributionPercentage);
        oldData.distribution = newData;
        localStorage.setItem('DaoCreationData',JSON.stringify(oldData));
        setTriggerToMain(triggerToMain+1);
    }

    const AlgoDuration = ()=>{
        const oldData = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')
        const newData = CodeDurationStats(contributors,distributionPercentage);
        oldData.distribution = newData;
        localStorage.setItem('DaoCreationData',JSON.stringify(oldData));
        setTriggerToMain(triggerToMain+1);
    }

    const handlePageSubmit = () => {
        const newData = {
            "DaoFees": DaoFees,
            "algorithm": algorithm,
            "network": network,
        }
        const oldData = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')
        const data = {...oldData,...newData}
        localStorage.setItem('DaoCreationData',JSON.stringify(data))
        router.push('/creation/4');
    }

    const AddNeonNetwork = async() =>{
        const chainId = 245022926 // remote proxy — solana devnet
        if (window.ethereum.networkVersion !== chainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.utils.hexValue(chainId)}]
                });
            }   catch (err:any) {
                  // This error code indicates that the chain has not been added to MetaMask
                if (err.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainName: 'remote proxy — solana devnet',
                                chainId: ethers.utils.hexValue(chainId),
                                nativeCurrency: { name: 'NEON', decimals: 18, symbol: 'NEON' },
                                rpcUrls: ['https://proxy.devnet.neonlabs.org/solana']
                            }
                        ]
                    });
                }
            }
        }
    }

    return (
        <div 
        className='w-1/3 h-5/6 bg-[#121418] mx-[3.4%] rounded-2xl p-[1.5%] text-white flex flex-col justify-between items-center customGradient'
        >
            <div className='flex flex-col justify-start items-start h-[90%] w-full' >
                {/* input feild */}
                <div className='w-full relative'>
                    <input type="text" name='DaoFees' className={`bg-[#121418] w-full py-[2%] px-[4%] my-[1%] text-[1.63vh] font-semibold rounded-md border-[#373737] border`} placeholder='Enter DAO Fees' value={DaoFees} onChange={(e)=>setDaoFees(e.target.value)} required />
                    <InformationCircleIcon className='w-[5%] absolute top-[30%] right-[3%]' />
                </div>
                <div className='w-full relative'>
                    <input type="number" name='EnterDistribution' className={`bg-[#121418] w-full py-[2%] px-[4%] my-[1%] text-[1.63vh] font-semibold rounded-md border-[#373737] border disabled:border-green-900`} placeholder='Enter Distribution %' value={distributionPercentage} disabled={!editDistribution}
                    onChange={(e)=>setDistributionPercentage(e.target.value)} required />
                    {editDistribution && <CheckIcon className='w-[5%] absolute top-[30%] right-[3%]'
                    onClick={()=>{
                        setEditDistribution(false)
                        const storeData = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')
                        if(distributionPercentage!==''){
                            storeData.distributionPercentage = distributionPercentage;
                        }else{
                            storeData.distributionPercentage = '0';
                            setDistributionPercentage('0');
                        }
                        localStorage.setItem('DaoCreationData',JSON.stringify(storeData))
                        if(algorithm==='Repository creator'){
                            AlgoOwner();
                        }else if(algorithm==='By amount of code contributed ( minified )'){
                            AlgoCode();
                        }else{
                            setTriggerToMain(triggerToMain+1);
                        }
                    }} />}
                    {!editDistribution && <PencilIcon className='w-[5%] absolute top-[30%] right-[3%]'
                    onClick={()=>{
                        setEditDistribution(true)
                    }} />}
                </div>

                {/* options */}
                <div className={`text-[1.81vh] mt-[3%] font-semibold`} >Token Distribution Algorithm <InformationCircleIcon className='w-[3.5%] inline' /></div>

                <div className={`text-[1.63vh] mt-[2%] flex flex-row w-full justify-start items-center`}>
                    <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                        <input type="radio" name="TokenAlgo" className='peer absolute opacity-0 w-full h-full cursor-pointer' value='Repository creator' 
                        onChange={(e)=>{
                            if(e.target.checked){
                                AlgoOwner();
                                setAlgorithm(e.target.value);
                            }
                        }} />
                        <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                        flex justify-center items-center
                        peer-checked:after:block
                        after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                    </div>
                    <div>
                        Repository creator
                    </div>
                </div>
                <div className={`text-[1.63vh] mt-[2%] flex flex-row w-full justify-start items-center`}>
                    <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                        <input type="radio" name="TokenAlgo" className='peer absolute opacity-0 w-full h-full cursor-pointer' value='By amount of code contributed ( minified )' 
                        onChange={(e)=>{
                            if(e.target.checked){
                                AlgoCode();
                                setAlgorithm(e.target.value);
                            }
                        }} />
                        <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                        flex justify-center items-center
                        peer-checked:after:block
                        after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                    </div>
                    <div>
                        By amount of code contributed ( minified )
                    </div>
                </div>
                <div className={`text-[1.63vh] mt-[2%] flex flex-row w-full justify-start items-center`}>
                    <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                        <input type="radio" name="TokenAlgo" className='peer absolute opacity-0 w-full h-full cursor-pointer' value='By duration of project involvement ( compute intensive )' 
                        onChange={(e)=>{
                            if(e.target.checked){
                                AlgoDuration();
                                setAlgorithm(e.target.value);
                            }
                        }} />
                        <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                        flex justify-center items-center
                        peer-checked:after:block
                        after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                    </div>
                    <div>
                        By duration of project involvement ( compute intensive ) 
                    </div>
                </div>

                {/* network */}
                <div className={`text-[1.81vh] mt-[3%] font-semibold`} >Supported Networks</div>

                <div className={`text-[1.63vh] mt-[2%] w-full flex flex-row w-full justify-between items-center`}>
                    <div className='flex flex-row w-full justify-start items-center'>
                        <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                            <input type="radio" name="NetworkOp" className='peer absolute opacity-0 w-full h-full cursor-pointer' value='Neon Testnet' 
                            onChange={(e)=>{
                                if(e.target.checked){
                                    setNetwork(e.target.value);
                                }
                            }} />
                            <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                            flex justify-center items-center
                            peer-checked:after:block
                            after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                        </div>
                        <div>
                            Neon Testnet
                        </div>
                    </div>
                    <button onClick={AddNeonNetwork}  className='w-[30%] text-[#A7B9FC]' >
                        + Add Network
                    </button>
                </div>

                {/* Assign Distribution */}
                {/* Search User */}
                <div className='w-full relative mt-[3%]'>
                    <input type="text" name='SearchUser' className={`bg-[#121418] w-full py-[2%] px-[4%] my-[1%] text-[1.63vh] font-semibold rounded-md border-[#3A4E70] border`} placeholder='Search contributors by username' value={search}
                    onChange={(e) => setSearch(e.target.value)} />
                    <SearchIcon className='w-[5%] absolute top-[30%] right-[3%] text-[#3A4E70]' />
                </div>
                <div className='flex flex-col justify-start items-center h-[100%] w-full relative overflow-y-scroll overflow-x-hidden customScrollbar'>
                    <div className='bg-[#121418] w-full h-[20%] px-[2%] py-[2%] mt-[2%] text-xs font-semibold rounded-md border-[#2E2E2F] border flex flex-row align-center justify-between' >
                        {/* user name */}
                        <div className='flex flex-row'>
                            <img src={JSON.parse(localStorage.getItem('DaoCreationData')||'{}').tokenImgPreview} className='w-[2.5vh] h-[2.5vh] mr-[1vh] rounded-full'/>
                            <div className={`text-[#D7D7D7] text-[1.63vh]`}>{JSON.parse(localStorage.getItem('DaoCreationData')||'{}').daoName} DAO</div>
                        </div>
                        {/* user distribution */}
                        <div className={`px-[1%] text-[1.63vh] text-[#B5C3DB]
                        flex flex-row align-center justify-center`} >
                            <div>{
                            (JSON.parse(localStorage.getItem('DaoCreationData')||'{}').distributionPercentage)!==undefined 
                            ?`${100 - parseInt(JSON.parse(localStorage.getItem('DaoCreationData')||'{}').distributionPercentage)}%`:'100%'}</div> 
                        </div>
                    </div>

                    {isLoading && <div className='m-auto'>Loading...</div>}
                    {!isLoading && contributorSearch.length > 0 && contributorSearch.map((contributor:any, idx:any)=>{
                        return (
                        <UserOptions contributor={contributor} key={idx}
                        triggerToMain={triggerToMain} 
                        setTriggerToMain={setTriggerToMain}
                        triggerSearch={triggerSearch} />
                        )
                    })}

                </div>

            </div>
            {/* Submit Btn */}
            <button className={`bg-[#91A8ED] w-full py-[2%] text-[1.63vh] ${(errorMsg!=='')?'border-red-500 border-b-2 text-black':null} font-semibold rounded-md`}
            onClick={()=>{
                if(DaoFees==='' || distributionPercentage==='' || algorithm==='' || network==='' || editDistribution){
                    setErrorMsg("- fill all fields")
                    return
                }else if(localStorage.getItem('distributionOk')==='false'){
                    setErrorMsg("- % doesn't add upto 100%")
                    return
                }
                handlePageSubmit()
            }} >
                Confirm Token Distribution {errorMsg}
            </button>
        </div>
    );
}

export default CreationDistribution;