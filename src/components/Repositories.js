import { useQuery, gql } from "@apollo/client";
import '../style/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCheckCircle, faBomb, faCircle } from '@fortawesome/free-solid-svg-icons'
import QueryData from '../Data/queryData';


function GetRepository(data)
{
    let languages = data.viewer.repositories.edges
        .map(({ node }) => node.languages.edges)
        .flat()
        .map(({size, node}) => node.name)



    console.log(languages);

}

function Repositories() {

    const { loading, error, data } = useQuery(QueryData());
    if (loading) return null;
    if (error) return <p>Error :(</p>;

    let languages = data.viewer.repositories.edges
        .map(({ node }) => node.languages.edges)
        .flat()
        .map(({ node }) => node.name + node.color);

    languages = languages.filter((item, index) => languages.indexOf(item) === index);

    GetRepository(data);
    return (
        <section>
            <div className="repoHeader">
                <h1 className="viewerName">Repositories</h1>
                <div className="repoInfo">
                    <p className="text">
                        {data.viewer.repositories.totalCount} repos
                    </p>
                    <p className="text">
                        Last updated: {data.viewer.updatedAt.replace(/[A-Z]/g, " ")}
                    </p>
                </div>
            </div>
            <div>
                <div className="arrayContainer">
                    <table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Repository</th>
                            <th>Commits</th>
                            <th>Team</th>
                            <th>Language</th>
                            <th>Timeline</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.viewer.repositories.edges.map((repo, index) => (index += 1,
                                <tr>
                                    <td>{index}</td>
                                    <td>
                                        <div className="infoRepLine">
                                            <div className="repoNameRowContainer">
                                                <img src={repo.node.owner.avatarUrl} alt="owner avatar" className="ownerAvatar" />
                                                <p className="repoNameTxt">
                                                    {repo.node.name}
                                                </p>
                                                <FontAwesomeIcon icon={faCheckCircle} className="gitCheckIcon" />
                                            </div>
                                            <div className="repoDescRowCont">
                                                <FontAwesomeIcon icon={faBomb} className="gitCheckIcon" />
                                                <p className="repoNameTxt">
                                                    {repo.node.description}
                                                </p>
                                            </div>
                                            <div className="repoDescRowCont">
                                                <img src={repo.node.owner.avatarUrl} alt="owner avatar" className="ownerAvatar" />
                                                <p className="repoNameTxt">
                                                    {repo.node.resourcePath}
                                                </p>
                                            </div>
                                            <div className="languagesPerRepo">
                                                {repo.node.languages.edges.map((lang) => (
                                                    <div className="itemlang">
                                                        <p className="text">
                                                            {lang.node.name}
                                                        </p>
                                                        <FontAwesomeIcon icon={faCircle} className="repoTagIcon" color={lang.node.color} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                {repo.node.defaultBranchRef.target.signature != null ?
                                                    <div>
                                                        <div className="repoDescRowCont">
                                                            <FontAwesomeIcon icon={faCheckCircle} className="gitCheckIcon" />
                                                            <p className="repoNameTxt">
                                                                Verified
                                                            </p>
                                                        </div>
                                                        <img src={repo.node.defaultBranchRef.target.signature.signer.avatarUrl} alt="signer avatar" className="signerAvatar" />
                                                        <p className="text">
                                                            {repo.node.defaultBranchRef.target.signature.signer.login}
                                                        </p>
                                                    </div>
                                                    :
                                                    null
                                                }
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="commitsRowContainer">
                                            <div>
                                                <p >
                                                    {repo.node.defaultBranchRef.target.history.totalCount}
                                                </p>
                                            </div>
                                            <div className="commitsTagsCont">
                                                <div className="commitItemGreen"></div>
                                                <div className="commitItemGray"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {repo.node.collaborators.totalCount}
                                    </td>
                                    <td>
                                        <div className="repoDescRowCont">
                                            <p className="text">C</p>
                                            <FontAwesomeIcon icon={faCircle} className="tagIcon" />
                                        </div>
                                    </td>
                                    <td>Time</td>
                                </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}


export default Repositories;

