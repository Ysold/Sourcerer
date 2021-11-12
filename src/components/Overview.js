import React from "react";
import { useQuery, gql } from "@apollo/client";
import '../style/main.css';
import { Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import QueryData from '../Data/queryData';



function Overview() {

    const { loading, error, data } = useQuery(QueryData());
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    let languages = data.viewer.repositories.edges
        .map(({ node }) => node.languages.edges)
        .flat()
        .map(({ node }) => node.name);
    languages = languages.filter((item, index) => languages.indexOf(item) === index);



    let languagesColor = data.viewer.repositories.edges
        .map(({ node }) => node.languages.edges)
        .flat()
        .map(({ node }) => node.color);
    languagesColor = languagesColor.filter((item, index) => languagesColor.indexOf(item) === index);



    return (
        <section className="overviewContainer">
            <div className="bioContainer">
                <h1 className="viewerName">
                    Overview
                </h1>
                <div className="overviewheader">
                    <p className="text">
                        {data.viewer.repositories.totalCount} repos
                    </p>
                    <p className="text">
                        Last updated: {data.viewer.updatedAt.replace(/[A-Z]/g, " ")}
                    </p>
                </div>
            </div>
            <div>
                <Bar
                    data={{
                        labels: languages.map(lang => lang),
                        datasets: [
                            {
                                label: '',
                                data: data.viewer.repositories.edges.map(edge => edge.node.defaultBranchRef.target.history.totalCount),
                                backgroundColor: languagesColor.map(color => color),
                                borderWidth: 1,
                            },
                        ],
                    }}
                    options={{
                        title: {
                            display: true,
                            text: 'Average commits per language',
                            fontSize: 20
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        }
                    }}
                />
            </div>
        </section>
    )
}


export default Overview;