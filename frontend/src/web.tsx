import { useState, useEffect } from 'react'

interface serie {
    serie: string,
    status: string,
    kategorie: string,
    favorit: boolean,
    id: number,
}

export default function Website() {
    //Variablen für das Backend
    const backend = "http://192.168.178.108:3001" //WICHTIG! BACKEND LINK ÜBERPRÜFEN!!

    //Variablen die die Seite
    const [panel, setPanel] = useState("login")
    const [loggedIn, setLoggedIn] = useState(false)
    const [loggedInUser, setLoggedInUser] = useState("")

    //Variablen für das Login / Register
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")

    //Variablen für die Liste
    const [liste, setListe] = useState<serie[]>([])
    const [serie, setSerie] = useState("")
    const [kategorie, setKategorie] = useState("")

    // Variablen für den Filter
    const [enableFilter, setEnableFilter] = useState(false)
    const [filterSerie, setFilterSerie] = useState("")
    const [filterKategorie, setFilterKategorie] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const [filterFavorit, setFilterFavorit] = useState(false)

    useEffect(() => {
        if (loggedIn) {
            fetch(`${backend}/users/${loggedInUser}/items`)
                .then(res => res.json())
                .then(data => setListe(data))
        }
    }, [loggedInUser, backend])

    return (
        <div>
            {!loggedIn ? (
                <> {/* Login / Register */}
                    {panel === "login" ? "Noch kein Account vorhanden? " : "Du hast bereits einen Account? "}

                    <button onClick={() => { //Switch Panel
                        panel === "login" ? setPanel("register") : setPanel("login")
                    }}>{panel === "login" ? "Register" : "Login"}</button>
                    {panel === "login" ? (
                        <> {/* Login Panel */}
                            <h1>Login</h1>
                            <input type="text" placeholder="Benutzername" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input type="text" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} />

                            <button onClick={() => { //Login Button
                                const loginData = { username, password }
                                fetch(`${backend}/login`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(loginData)
                                })
                                    .then(res => res.json())
                                    .then(data => {
                                        setListe([])
                                        setLoggedIn(data.status)
                                        setLoggedInUser(data.user)
                                        if (data.message) {
                                            alert(data.message);
                                        }
                                    })
                            }}>Login</button>
                        </>
                    ) : (
                        <> {/* Register Panel */}
                            <h1>Register</h1>
                            <input type="text" placeholder="Benutzername" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input type="text" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <input type="text" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <input type="text" placeholder="Passwort wiederholen" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />

                            <button onClick={() => { //Register Button
                                const registerData = { username, email, password, repeatPassword }
                                fetch(`${backend}/register`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(registerData)
                                })
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.message) {
                                            alert(data.message);
                                        }
                                    })
                            }}>Register</button>
                        </>
                    )}
                </>
            ) : (
                <> {/* Netflix Liste */}
                    <h1>Aktuell angemeldet: {loggedInUser}</h1>
                    <button onClick={() => {
                        setLoggedInUser("")
                        setLoggedIn(false)
                    }}>Logout</button>
                    <br /><br /><br />

                    <> {/* Serie hinzufügen */}
                        <input type="text" placeholder="Name der Serie" value={serie} onChange={(e) => setSerie(e.target.value)} />
                        <input type="text" placeholder="Kategorie (optional)" value={kategorie} onChange={(e) => setKategorie(e.target.value)} />

                        <button onClick={() => {
                            const newUser = { serie, kategorie }
                            fetch(`${backend}/users/${loggedInUser}/items`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(newUser)
                            })
                                .then(res => res.json())
                                .then(data => setListe([...liste, data]))
                        }}>Serie hinzufügen</button>
                    </>

                    <br /><br /><br />

                    <> {/* Filter */}
                        <button onClick={() => {
                            if (enableFilter) {
                                setEnableFilter(false)
                                setFilterSerie("")
                                setFilterKategorie("")
                                setFilterStatus("")
                                setFilterFavorit(false)
                            } else setEnableFilter(true)
                        }}>Filter</button>
                        {enableFilter ? 
                            <>
                            <input type="text" placeholder="Filter nach Serie" value={filterSerie} onChange={(e) => setFilterSerie(e.target.value)}/>
                            <input type="text" placeholder="Filter nach Kategorie" value={filterSerie} onChange={(e) => setFilterSerie(e.target.value)}/>
                            <button onClick={() => {filterStatus === "unwatched" ? setFilterStatus("watched") : filterStatus === "watched" ? setFilterStatus("") : setFilterStatus("unwatched")}}>{filterStatus === "" ? "Alle Serie" : filterStatus === "unwatched" ? "Offene Serien" : "Geschaute Serien"}</button>
                            <button onClick={() => {filterFavorit ? setFilterFavorit(false) : setFilterFavorit(true)}}>{filterFavorit ? "Favoriten" : "Alle"}</button>
                            </>
                         : ""}
                    </>

                    <br /><br /><br />

                    <> {/* Liste der Serien */}
                        <table>
                            <thead>
                                <tr>
                                    <td>Favorit</td>
                                    <td>Name der Serie</td>
                                    <td>Kategorie</td>
                                    <td>Status</td>
                                    <td>Löschen</td>
                                </tr>
                            </thead>
                            <tbody>
                                {liste.filter(item => item.serie.includes(filterSerie)).filter(item => item.kategorie.includes(filterKategorie)).filter(item => filterFavorit ? item.favorit : true).filter(item => filterStatus === "" ? true : item.status === filterStatus).map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <button onClick={() => {
                                                fetch(`${backend}/users/${loggedInUser}/items/${item.id}/update/favorit`, {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                })
                                                    .then(res => res.json())
                                                    .then(data => setListe(data))
                                            }}>
                                                {item.favorit ? "X" : "0"}
                                            </button>
                                        </td>
                                        <td>{item.serie}</td>
                                        <td>{item.kategorie}</td>
                                        <td>
                                            <button onClick={() => {
                                                fetch(`${backend}/users/${loggedInUser}/items/${item.id}/update/status`, {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                })
                                                    .then(res => res.json())
                                                    .then(data => setListe(data))
                                            }}>
                                                {item.status === "watched" ? "Geschaut" : "Noch offen"}
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => {
                                                fetch(`${backend}/users/${loggedInUser}/items/${item.id}/delete`, {
                                                    method: 'DELETE',
                                                    headers: { 'Content-Type': 'application/json' },
                                                })
                                                    .then(res => res.json())
                                                    .then(data => setListe(data))
                                            }}>
                                                Löschen
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                </>
            )}
        </div>
    );
}