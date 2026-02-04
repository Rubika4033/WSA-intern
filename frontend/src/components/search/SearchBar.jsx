import React, { useEffect, useState } from "react";
import {Cisearch} from "react-icons/ci";
import "../../css/search/SearchBar.css";
import axios  from "axios";


const SearchBar = (setSearchSongs) => {
  const [query,setQuery]=useState("");
  const [loading,setLoading]= useState(false);

  useEffect(() => {
    if(!query.trim()){
      setSearchSongs([]);
      return;

    }
    const fetchSongs=async ()=>{
      try{
        setLoading(true);
        const res=await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/songs/playListByTag/${encodeURIComponent(query)}`,
        );
        setSearchSongs(res.data.results);
      }
      catch(error){
        console.error("Jamendo Search failed",error);
        setSearchSongs([]);
      }finally{
        setLoading(false);
      }
    };
     const debounce=setTimeout(fetchSongs,400);
     return ()=> clearInterval(debounce);
  }, [query,setSearchSongs]);
  return (
    <div className="searchbar-root">
      <div className="searchbar-input-wrapper">
        <input
        className="searchbar-input"
        type="text"
        value={query}
        onChange={(e) =>setQuery(e.target.value)}
        autoFocus
        />
      <CiSearch className="searchbar-icon" size={20}/>

      </div>
      {!query && !loading && (
        <p className="searchbar-empty"> Search song to display</p>
      )} 
      {loading && <p className="searchbar-loading">Searching...</p>}
      
        

    </div>
  );
};

export default SearchBar;
