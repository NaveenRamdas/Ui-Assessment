import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import "../App.css"
import { useInView } from "react-intersection-observer";
import { Spin } from "antd";
const Home = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showData, setShowData] = useState(false);
    const [pageDetails, setPageDetails] = useState({
        page: 1,
        limit: 10
    })
    const [btnType, setBtnType] = useState(null);


    const [isFetching, setIsFetching] = useState(false);

    const { ref, inView, entry } = useInView();

    const memoizedPageDetails = useMemo(() => pageDetails, [pageDetails.page, pageDetails.limit]);


    const buttonStyle = {
        borderRadius: "16px",
        padding: "10px 20px",
        border: "none",
        boxShadow: "0px 5px 10px 4px lightgrey",
        cursor: "pointer",
        backgroundColor: "transparent",
        color: "black",
        transition: "background-color 0.3s ease, color 0.3s ease",
    };
    const fetchData = async () => {


        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`https://api.thecatapi.com/v1/images/search?limit=${pageDetails?.limit}&page=${pageDetails?.page}&order=Desc`);
            const result = response.data;

            if (result.length === 0) {
                setData([]);
            } else {
                setData(result);
            }
        } catch (err) {
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (btnType !== "fetchScroll") {

            showData && fetchData()
        }
    }, [pageDetails, btnType])



    const handleBtnClick = (type) => {
        setShowData(true)
        setBtnType(type);
        console.log("fromBtn", type)
    }
    const handleBtnClickScroll = (type) => {
        setShowData(true)
        setBtnType(type);
        console.log("fromBtnScroll", type)
    }
    const fetchDataScroll = async () => {
        if (isFetching) return;
        setIsFetching(true);
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `https://api.thecatapi.com/v1/images/search?limit=${memoizedPageDetails?.limit}&page=${memoizedPageDetails?.page}&order=Desc`
            );
            const result = response.data;

            setData((prevData) => [...prevData, ...result]); // Append new data to existing
            setPageDetails((prev) => ({
                ...prev,
                page: prev?.page + 1
            }));
        } catch (err) {
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
            setIsFetching(false); // Allow further fetching once this completes
        }
    };

    // Handle scroll for infinite scrolling
    const handleScroll = () => {
        // Check if the user is at the bottom of the page
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100 && !isFetching
        ) {
            // Increase the page number only if not fetching already

        }
    };

    console.log("pageitem", pageDetails)
    // useEffect to attach the scroll event
    useEffect(() => {
        if (btnType === "fetchScroll") {
            window.addEventListener("scroll", handleScroll);
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [btnType]);

    useEffect(() => {
        if (btnType === "fetchScroll") {
            fetchDataScroll();
        }
    }, [inView, btnType]);


    return (
        <div style={{ padding: 50 }}>

            <button
                style={{
                    cursor: "pointer",
                    marginRight: 20,
                    backgroundColor: btnType === "fetchOnly" ? "#00374a" : "transparent",
                    color: btnType === "fetchOnly" ? "white" : "black",
                    borderRadius: "16px",
                    padding: "10px 20px",
                    border: "none",
                    boxShadow: "0px 5px 10px 4px lightgrey"
                }}
                onClick={() => handleBtnClick("fetchOnly")}
            >
                Fetch Only Data
            </button>

            <button
                style={{
                    cursor: "pointer",
                    marginRight: 20,
                    backgroundColor: btnType === "fetchPage" ? "#00374a" : "transparent",
                    color: btnType === "fetchPage" ? "white" : "black",
                    borderRadius: "16px",
                    padding: "10px 20px",
                    border: "none",
                    boxShadow: "0px 5px 10px 4px lightgrey"
                }}
                onClick={() => handleBtnClick("fetchPage")}
            >
                Fetch Data With Pagination
            </button>

            <button
                style={{
                    cursor: "pointer",
                    backgroundColor: btnType === "fetchScroll" ? "#00374a" : "transparent",
                    color: btnType === "fetchScroll" ? "white" : "black",
                    borderRadius: "16px",
                    padding: "10px 20px",
                    border: "none",
                    boxShadow: "0px 5px 10px 4px lightgrey"
                }}
                onClick={() => handleBtnClickScroll("fetchScroll")}
            >
                Fetch Data with Infinite Scroll
            </button>
            {loading && <center style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}><Spin size="large" />Please wait...</center>
            }


            {error && <p>{error}</p>}


            {!loading && !error && data.length === 0 && <p>Click Button to fetch data</p>}

            {/* Grid Display of Cards */}
            {btnType == "fetchOnly" && <>
                <div
                    style={{
                        display: "grid",
                        flexDirection: "column",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "10px",
                        marginTop: "20px",


                    }}
                >
                    {data.map((item, index) => (
                        <div
                            key={item.id}
                            style={{

                            }}
                        >
                            <img
                                src={item.url}
                                alt="Cat"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",

                                    borderRadius: "8px",

                                    width: "100%",
                                    height: "auto",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",

                                }}
                            />
                        </div>
                    ))}
                </div>
            </>}
            {btnType == "fetchPage" && <>
                <div
                    style={{
                        display: "grid",
                        flexDirection: "column",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "10px",
                        marginTop: "20px",


                    }}
                >
                    {data.map((item, index) => (
                        <div
                            key={item.id}
                            style={{

                            }}
                        >
                            <img
                                src={item.url}
                                alt="Cat"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",

                                    borderRadius: "8px",

                                    width: "100%",
                                    height: "auto",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",

                                }}
                            />
                        </div>
                    ))}

                </div>
                <div style={{ padding: 50 }}>
                    <button
                        disabled={pageDetails.page <= 1}
                        style={{
                            ...buttonStyle,
                            marginRight: 50,
                            backgroundColor: pageDetails.page > 1 ? "transparent" : "lightgrey",
                            cursor: pageDetails.page > 1 ? "pointer" : "not-allowed"
                        }}
                        className="hover-effect"
                        onClick={() => {
                            setPageDetails((prev) => ({
                                ...prev,
                                page: prev.page - 1,
                            }));
                        }}
                    >
                        Prev
                    </button>

                    <button
                        style={buttonStyle}
                        className="hover-effect"
                        onClick={() => {
                            setPageDetails((prev) => ({
                                ...prev,
                                page: prev.page + 1,
                            }));
                        }}
                    >
                        Next
                    </button>

                </div>
            </>}
            {btnType == "fetchScroll" && <>
                <div

                    style={{
                        display: "grid",
                        flexDirection: "column",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "10px",
                        marginTop: "20px",
                        padding: 50

                    }}
                >
                    {data.map((item, index) => (
                        <div
                            key={item.id}
                            style={{

                            }}
                        >
                            <img
                                src={item.url}
                                alt="Cat"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",

                                    borderRadius: "8px",

                                    width: "100%",
                                    height: "auto",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",

                                }}
                            />
                        </div>
                    ))}
                    {loading && <center style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}><Spin size="large" />Please wait...</center>
                    }
                    {error && <p>{error}</p>}
                    <div ref={ref}></div>
                </div>
            </>}
        </div>
    );
};

export default Home;
