import { useQuery, gql } from "@apollo/client";
import '../style/main.css';
import Overview from './Overview';
import Languages from './Languages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Repositories from './Repositories';
import { faShareAlt, faSortDown } from '@fortawesome/free-solid-svg-icons'
import QueryData from '../Data/queryData';




const data = gql`
  query user{
    viewer{
      name, 
      bio, 
      location,
      avatarUrl,
      company, 
      following{
        totalCount
      },
      followers{
        totalCount
      },
      updatedAt,
      repositories(first: 2){
        totalCount, 
        edges{
          node{
            resourcePath,
            description,
            updatedAt,
            name,
            owner{
              login
            },
            collaborators{
              totalCount
            }
            updatedAt,
            languages(first: 10){
              edges{
                node{
                  name, 
                  color
                }
              }
            },
            defaultBranchRef{
              target{
                ... on Commit{
                  signature{
                    isValid
                  }
                  tree{
                    entries{
                      extension,
                      name,
                    }
                  },
                  history{
                    totalCount,
                  },
                  additions,
                  deletions, 
                  history{
                    totalCount
                  }
                }
              }
            }
          }
        }
      },
    }
    }
`;



function GetNumberOfCommits({ repositories }) {
    const reducer = (previous, current) => {
        return (
            previous.node.defaultBranchRef.target.additions - previous.node.defaultBranchRef.target.deletions +
            current.node.defaultBranchRef.target.additions - current.node.defaultBranchRef.target.deletions
        )
    }
    const total = repositories.edges.reduce(reducer);
    return <p className="text">{total}</p>
}



function GetNumberLinesOfCodes({ repositories }) {
    const reducer = (previous, current) => {
        return (
            previous.node.defaultBranchRef.target.history.totalCount + current.node.defaultBranchRef.target.history.totalCount
        )
    }
    const total = repositories.edges.reduce(reducer);
    return <p className="text">{total}</p>
}


function DisplayNavBar() {

    const { loading, error, data } = useQuery(data);
    const { query } = useQuery(QueryData());
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    
        // Je n'ai pas réussi à afficher mon nom ni la société mais j'ai mis les commandes permettant d'y acceder

    return (
        <section>
            <div className="grayBar"></div>
            <div className="popInfo">
                <p>
                    Did you know ? You can add statistics from your private repos to your profile
                </p>
            </div>
            <section className="container">
                <div className="shareProfile">
                    <p>
                        Share your profile on :
                    </p>
                    <ul className="shareList">
                        <li>
                            <a href="https://www.linkedin.com/">LinkedIn</a>
                        </li>
                        <li>
                            <a href="https://twitter.com/">Twitter</a>
                        </li>
                        <li>
                            <a href="https://fr-fr.facebook.com/">Facebook</a>
                        </li>
                    
                    </ul>
                </div>
                
                <div className="bioContainer">
                    
                    <h1 className="viewerName">
                        {data.viewer.name}
                    
                    </h1>
                    <div className="bio">
                        <div className="bioAndLocation">
                            <p>
                                {data.viewer.bio} at {data.viewer.company}
                            </p>
                            <p>
                                {data.viewer.location}
                            </p>
                        </div>
                    </div>
                </div>

                <section className="containerGeneralInfo">
                    <div className="avatarContainer">
                        <img src={data.viewer.avatarUrl} alt="avatar" className="avatarPhoto" />
                    </div>
                    <div className="commitsReposLinesCodeBox">
                        <p className="text">
                            Commits
                        </p>
                        <GetNumberLinesOfCodes repositories={data.viewer.repositories} />
                    </div>
                    <div className="commitsReposLinesCodeBox">
                        <p className="text">
                            Repos
                        </p>
                        <p className="text">
                            {data.viewer.repositories.totalCount}
                        </p>
                    </div>
                    <div className="commitsReposLinesCodeBox">
                        <p className="text">
                            Lines of codes
                        </p>
                        <GetNumberOfCommits repositories={data.viewer.repositories} />
                    </div>
                    <div className="followInfo">
                        <p className="text">
                            Followers
                        </p>
                        <div className="descFollowers">
                            <div>
                                <p className="text">
                                    {data.viewer.followers.totalCount}
                                </p>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faShareAlt} />
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                    <div className="followInfo">
                        <p className="text">
                            Following
                        </p>
                        <p className="text">
                            {data.viewer.following.totalCount}
                        </p>
                    </div>
                    <div className="refresh">
                        <p className="text">
                            Refresh
                        </p>
                        <div>
                            <FontAwesomeIcon icon={faSortDown} className="tagIcon" />
                        </div>
                    </div>
                </section>
                <Overview data={data}/>
                <Languages />
                <Repositories />
               
            </section>
        </section>
        
    )
}

export default DisplayNavBar;