import { useState, useEffect } from 'react'

import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

interface serie {
    serie: string,
    status: string,
    kategorie: string,
    sterne: number,
    favorit: boolean,
    id: number,
}

interface update {
    text: string,
    id: number,
}

export default function Website() {
    //Variablen für das Backend
    const backend = "http://192.168.178.108:3001" //WICHTIG! BACKEND LINK ÜBERPRÜFEN!!

    //Variablen die die Seite
    const [panel, setPanel] = useState("login")
    const [loggedIn, setLoggedIn] = useState(false)
    const [loggedInUser, setLoggedInUser] = useState("")

    //Variablen für das Nutzer Menü
    const [userMenu, setUserMenu] = useState(false)

    //Variablen für das Login / Register
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")

    //Variablen für die Liste
    const [liste, setListe] = useState<serie[]>([])
    const [serie, setSerie] = useState("")
    const [kategorie, setKategorie] = useState("")
    const [updateSerie, setUpdateSerie] = useState<update[]>([])
    const [updateKategorie, setUpdateKategorie] = useState<update[]>([])

    //Variablen für den Filter
    const [enableFilter, setEnableFilter] = useState(false)
    const [filterSerie, setFilterSerie] = useState("")
    const [filterKategorie, setFilterKategorie] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const [filterFavorit, setFilterFavorit] = useState(false)
    const [filterSterne, setFilterSterne] = useState(0)

    //Variablen für Edit Menü
    const [edit, setEdit] = useState(false)
    const [enableEditUsername, setEnableEditUsername] = useState(false)
    const [editUsername, setEditUsername] = useState("")
    const [enableEditEmail, setEnableEditEmail] = useState(false)
    const [editEmail, setEditEmail] = useState("")
    const [oldPassword, setOldPassword] = useState("")

    useEffect(() => {
        if (loggedIn) {
            fetch(`${backend}/users/${loggedInUser}/items`)
                .then(async res => {
                    const data = await res.json()
                    if (!res.ok) {
                        alert("Es ist ein Fehler aufgetreten: " + data.message)
                        return null
                    }
                    return data
                })
                .then(data => { if (data) setListe(data) })
        }
    }, [loggedInUser, backend, loggedIn])

    return (
        <div>
            {!loggedIn ? (
                <> {/* Login / Register */}
                    {panel === "login" ? (
                        <> {/* Login Panel */}
                            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', '& > :not(style)': { m: 1 } }}>
                                <h1>Login</h1>
                                <br /><br /><br />
                                <TextField autoComplete="off" label="Benutzername" variant="outlined" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                                <TextField autoComplete="off" label="Passwort" variant="outlined" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <br />
                                <Fab sx={{ backgroundColor: "lime" }} onClick={() => { //Login Button
                                    const loginData = { username, password }
                                    fetch(`${backend}/login`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(loginData)
                                    })
                                        .then(async res => {
                                            const data = await res.json()
                                            if (!res.ok) {
                                                alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                setPassword("")
                                                return null
                                            }
                                            return data
                                        })
                                        .then(data => {
                                            if (data) {
                                                setListe([])
                                                setLoggedIn(data.status)
                                                setEnableFilter(false)
                                                setFilterFavorit(false)
                                                setFilterKategorie("")
                                                setFilterSerie("")
                                                setFilterSerie("")
                                                setFilterSterne(0)
                                                setPassword("")
                                                setUsername("")
                                                setRepeatPassword("")
                                                setEmail("")
                                                setLoggedInUser(data.user)
                                                if (data.message) {
                                                    alert(data.message);
                                                }
                                            }
                                        })

                                }}><CheckIcon /></Fab>
                                <br /><br /><br /><br /><br />
                                Noch kein Account vorhanden?
                                <Fab size="small" variant="extended" onClick={() => {
                                    setPanel("register")
                                    setPassword("")
                                }}>Registrieren</Fab>
                            </Box>
                        </>
                    ) : (
                        <> {/* Register Panel */}
                            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', '& > :not(style)': { m: 1 } }}>
                                <h1>Register</h1>
                                <br /><br /><br />
                                <TextField autoComplete="off" label="Benutzername" variant="outlined" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                                <TextField autoComplete="off" label="E-Mail" variant="outlined" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <TextField autoComplete="off" label="Passwort" variant="outlined" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <TextField autoComplete="off" label="Passwort wiederholen" variant="outlined" type="text" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                                <br />
                                <Fab sx={{ backgroundColor: "lime" }} onClick={() => { //Register Button
                                    const registerData = { username, email, password, repeatPassword }
                                    fetch(`${backend}/register`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(registerData)
                                    })
                                        .then(async res => {
                                            const data = await res.json()
                                            if (!res.ok) {
                                                alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                setRepeatPassword("")
                                                return null
                                            }
                                            return data
                                        })
                                        .then(data => {
                                            if (data) {
                                                setPanel("login")
                                                setEmail("")
                                                setPassword("")
                                                setRepeatPassword("")
                                                if (data.message) {
                                                    alert(data.message);
                                                }
                                            }
                                        })
                                }}><CheckIcon /></Fab>
                                <br /><br /><br /><br /><br />
                                Du hast bereits einen Account?
                                <Fab size="small" variant="extended" onClick={() => {
                                    setPanel("login")
                                    setEmail("")
                                    setPassword("")
                                    setRepeatPassword("")
                                }}>Anmelden</Fab>
                            </Box>
                        </>
                    )}
                </>
            ) : (
                <>
                    {!edit ? ( //Netflix-Liste
                        <>
                            <> {/* Benutzer Menü */}
                                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                                    <Fab variant="extended" onClick={() => { userMenu ? setUserMenu(false) : setUserMenu(true) }}><b>{loggedInUser}</b></Fab>
                                    {userMenu ?
                                        <>
                                            <Fab size="small" onClick={() => {
                                                setEdit(true)
                                                setEnableEditUsername(false)
                                                setEditUsername(loggedInUser)
                                                setEnableEditEmail(false)
                                                fetch(`${backend}/users/${loggedInUser}/email`)
                                                    .then(async res => {
                                                        const data = await res.json()
                                                        if (!res.ok) {
                                                            alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                            return null
                                                        }
                                                        return data
                                                    })
                                                    .then(data => {
                                                        if (data) {
                                                            setEditEmail(data)
                                                        }
                                                    })

                                            }}>
                                                <EditIcon />
                                            </Fab>
                                            <Fab size="small" sx={{ backgroundColor: "red" }} onClick={() => {
                                                setLoggedInUser("")
                                                setLoggedIn(false)
                                            }}><LogoutIcon /></Fab>
                                        </>
                                        : ""}
                                </Box>
                                <br /><br /><br />
                            </>

                            <> {/* Serie hinzufügen */}
                                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                                    <TextField autoComplete="off" label="Name der Serie" variant="outlined" type="text" value={serie} onChange={(e) => setSerie(e.target.value)} />
                                    <TextField autoComplete="off" label="Kategorie (optional)" variant="outlined" type="text" value={kategorie} onChange={(e) => setKategorie(e.target.value)} />

                                    <Fab sx={{ backgroundColor: "lime" }} onClick={() => {
                                        const newSerie = { serie, kategorie: kategorie.trim() === "" ? "" : kategorie }
                                        fetch(`${backend}/users/${loggedInUser}/items`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(newSerie)
                                        })
                                            .then(async res => {
                                                const data = await res.json()
                                                if (!res.ok) {
                                                    alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                    return null
                                                }
                                                return data
                                            })
                                            .then(data => {
                                                setSerie("")
                                                setKategorie("")
                                                if (data) setListe(data)
                                            })
                                    }}><AddIcon /></Fab>
                                </Box>
                            </>

                            <br /><br /><br />

                            <> {/* Filter */}
                                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                                    <Fab onClick={() => {
                                        if (enableFilter) {
                                            setEnableFilter(false)
                                            setFilterSerie("")
                                            setFilterKategorie("")
                                            setFilterStatus("")
                                            setFilterFavorit(false)
                                            setFilterSterne(0)
                                        } else setEnableFilter(true)
                                    }}>{enableFilter ? <FilterAltIcon /> : <FilterAltOffIcon />}</Fab>
                                    {enableFilter ?
                                        <>
                                            <TextField autoComplete="off" variant="outlined" type="text" placeholder="Filter nach Serie" value={filterSerie} onChange={(e) => setFilterSerie(e.target.value)} />
                                            <TextField autoComplete="off" variant="outlined" type="text" placeholder="Filter nach Kategorie" value={filterKategorie} onChange={(e) => setFilterKategorie(e.target.value)} />
                                            <Fab variant="extended" onClick={() => { filterStatus === "unwatched" ? setFilterStatus("watched") : filterStatus === "watched" ? setFilterStatus("") : setFilterStatus("unwatched") }}><b>Status: &nbsp;</b> {filterStatus === "" ? "Alle" : filterStatus === "unwatched" ? "Nicht Geschaut" : "Geschaut"}</Fab>
                                            <Fab variant="extended">
                                                <Box sx={{ '& > :not(style)': { m: 0.35 } }}>
                                                    <Fab size="small" sx={{ backgroundColor: filterSterne >= 1 ? "yellow" : "default" }} onClick={() => { filterSterne === 1 ? setFilterSterne(0) : setFilterSterne(1) }}>{filterSterne >= 1 ? <StarIcon /> : <StarBorderIcon />}</Fab>
                                                    <Fab size="small" sx={{ backgroundColor: filterSterne >= 2 ? "yellow" : "default" }} onClick={() => { filterSterne === 2 ? setFilterSterne(0) : setFilterSterne(2) }}>{filterSterne >= 2 ? <StarIcon /> : <StarBorderIcon />}</Fab>
                                                    <Fab size="small" sx={{ backgroundColor: filterSterne >= 3 ? "yellow" : "default" }} onClick={() => { filterSterne === 3 ? setFilterSterne(0) : setFilterSterne(3) }}>{filterSterne >= 3 ? <StarIcon /> : <StarBorderIcon />}</Fab>
                                                    <Fab size="small" sx={{ backgroundColor: filterSterne >= 4 ? "yellow" : "default" }} onClick={() => { filterSterne === 4 ? setFilterSterne(0) : setFilterSterne(4) }}>{filterSterne >= 4 ? <StarIcon /> : <StarBorderIcon />}</Fab>
                                                    <Fab size="small" sx={{ backgroundColor: filterSterne >= 5 ? "yellow" : "default" }} onClick={() => { filterSterne === 5 ? setFilterSterne(0) : setFilterSterne(5) }}>{filterSterne >= 5 ? <StarIcon /> : <StarBorderIcon />}</Fab>
                                                </Box>
                                            </Fab>
                                            <Fab sx={{ backgroundColor: filterFavorit ? "red" : "default" }} onClick={() => { filterFavorit ? setFilterFavorit(false) : setFilterFavorit(true) }}>{filterFavorit ? <FavoriteIcon /> : <FavoriteBorderIcon />}</Fab>
                                            <br /><br />
                                            <b>Aktuelle Filter:&nbsp;</b> <br />
                                            {filterSerie !== "" ? "-> Serie enthält: " + filterSerie : ""}{filterSerie !== "" ? <br /> : ""}
                                            {filterKategorie !== "" ? "-> Kategorie enthält: " + filterKategorie : ""}{filterKategorie !== "" ? <br /> : ""}
                                            {filterStatus === "unwatched" ? "-> Status: Nicht Geschaut" : filterStatus === "watched" ? "-> Status: Geschaut" : ""}{filterStatus !== "" ? <br /> : ""}
                                            {filterSterne > 1 ? "-> Bewertet mit  " + filterSterne + " Sternen" : filterSterne === 1 ? "-> Bewertet mit 1 Stern" : ""}{filterKategorie !== "" ? <br /> : ""}
                                            {filterFavorit ? " -> Nur Favoriten" : ""}{filterKategorie !== "" ? <br /> : ""}
                                        </>
                                        : ""}
                                </Box>
                            </>

                            <br /><br /><br />

                            <> {/* Liste der Serien */}
                                {liste.length > 0 ?
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr style={{ backgroundColor: "#dac5c5ff", textAlign: "center", padding: "8px", border: '2px solid black' }}>
                                                <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Favorit</td>
                                                <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Name der Serie</td>
                                                <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Kategorie</td>
                                                <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Bewertung</td>
                                                <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Status</td>
                                                <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Löschen</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {liste.filter(item => item.serie.includes(filterSerie)).filter(item => item.kategorie.includes(filterKategorie)).filter(item => filterFavorit ? item.favorit : true).filter(item => filterStatus === "" ? true : item.status === filterStatus).filter(item => filterSterne !== 0 ? item.sterne === filterSterne : true).map((item, index) => (
                                                <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white" }}>
                                                    <td style={{ width: "5%", textAlign: "center", padding: "8px", border: '1px solid black' }}> {/* Favorit*/}
                                                        <Fab sx={{ backgroundColor: item.favorit ? "red" : "default" }} onClick={() => {
                                                            fetch(`${backend}/users/${loggedInUser}/items/${item.id}/update/favorit/0`, {
                                                                method: 'PUT',
                                                                headers: { 'Content-Type': 'application/json' },
                                                            })
                                                                .then(async res => {
                                                                    const data = await res.json()
                                                                    if (!res.ok) {
                                                                        alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                                        return null
                                                                    }
                                                                    return data
                                                                })
                                                                .then(data => { if (data) setListe(data) })
                                                        }}>
                                                            {item.favorit ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                        </Fab>
                                                    </td>
                                                    <td style={{ textAlign: "center", padding: "8px", border: '1px solid black' }}> {/* Serie*/}
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                                            <div style={{ flex: 1, textAlign: "center" }}>
                                                                {updateSerie.findIndex(data => data.id === item.id) === -1 ? item.serie :
                                                                    <TextField autoComplete="off" type="text" value={updateSerie.find(data => data.id === item.id)?.text} onChange={(e) => {
                                                                        setUpdateSerie(prev => prev.map(data => data.id === item.id ? { ...data, text: e.target.value } : data))
                                                                    }} />}
                                                            </div>
                                                            <Fab size="small" onClick={() => {
                                                                const findUpdate = updateSerie.findIndex(data => data.id === item.id)
                                                                if (findUpdate === -1) {
                                                                    const neuesUpdate = { text: item.serie, id: item.id }
                                                                    setUpdateSerie([...updateSerie, neuesUpdate])
                                                                    console.log("Update created!")
                                                                } else if (findUpdate !== -1) {
                                                                    fetch(`${backend}/users/${loggedInUser}/items/${item.id}/update/serie/0`, {
                                                                        method: 'PUT',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ text: updateSerie[findUpdate].text })
                                                                    })
                                                                        .then(async res => {
                                                                            const data = await res.json()
                                                                            if (!res.ok) {
                                                                                alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                                                return null
                                                                            }
                                                                            return data
                                                                        })
                                                                        .then(data => {
                                                                            if (data) {
                                                                                setUpdateSerie(prev => prev.filter(got => got.id !== item.id))
                                                                                setListe(prev => prev.map(got => got.id === item.id ? { ...got, serie: updateSerie[findUpdate].text } : got))
                                                                            }
                                                                        })
                                                                    console.log("Update found!")
                                                                }
                                                            }}>{updateSerie.findIndex(data => data.id === item.id) === -1 ? <EditIcon /> : <CheckIcon />}</Fab>
                                                        </div>
                                                    </td>
                                                    <td style={{ width: "15%", textAlign: "center", padding: "8px", border: '1px solid black' }}> {/* Kategorie*/}
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                                            <div style={{ flex: 1, textAlign: "center" }}>
                                                                {updateKategorie.findIndex(data => data.id === item.id) === -1 ? item.kategorie :
                                                                    <TextField autoComplete="off" type="text" value={updateKategorie.find(data => data.id === item.id)?.text} onChange={(e) => {
                                                                        setUpdateKategorie(prev => prev.map(data => data.id === item.id ? { ...data, text: e.target.value } : data))
                                                                    }} />}
                                                            </div>
                                                            <Fab size="small" onClick={() => {
                                                                const findUpdate = updateKategorie.findIndex(data => data.id === item.id)
                                                                if (findUpdate === -1) {
                                                                    const neuesUpdate = { text: item.kategorie, id: item.id }
                                                                    setUpdateKategorie([...updateKategorie, neuesUpdate])
                                                                    console.log("Update created!")
                                                                } else if (findUpdate !== -1) {
                                                                    fetch(`${backend}/users/${loggedInUser}/items/${item.id}/update/kategorie/0`, {
                                                                        method: 'PUT',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ text: updateKategorie[findUpdate].text })
                                                                    })
                                                                        .then(async res => {
                                                                            const data = await res.json()
                                                                            if (!res.ok) {
                                                                                alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                                                return null
                                                                            }
                                                                            return data
                                                                        })
                                                                        .then(data => {
                                                                            if (data) {
                                                                                setUpdateKategorie(prev => prev.filter(got => got.id !== item.id))
                                                                                setListe(prev => prev.map(got => got.id === item.id ? { ...got, kategorie: updateKategorie[findUpdate].text } : got))
                                                                            }
                                                                        })
                                                                    console.log("Update found!")
                                                                }
                                                            }}>{updateKategorie.findIndex(data => data.id === item.id) === -1 ? <EditIcon /> : <CheckIcon />}</Fab>
                                                        </div>
                                                    </td> {/* Kategorie*/}
                                                    <td style={{ width: "15%", textAlign: "center", padding: "8px", border: '1px solid black' }}> {/* Sterne (Bewertung)*/}
                                                        <Box sx={{ '& > :not(style)': { m: 0.25 } }}>
                                                            <Fab sx={{ backgroundColor: item.sterne >= 1 ? "yellow" : "default" }} size="small" onClick={() => {
                                                                fetch(`${backend}/users/${loggedInUser}/items/${item.id}/update/sterne/1`, {
                                                                    method: 'PUT',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                })
                                                                    .then(async res => {
                                                                        const data = await res.json()
                                                                        if (!res.ok) {
                                                                            alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                                            return null
                                                                        }
                                                                        return data
                                                                    })
                                                                    .then(data => { if (data) setListe(data) })
                                                            }}>{item.sterne >= 1 ? <StarIcon /> : <StarBorderIcon />}</Fab>

                                                            <Fab sx={{ backgroundColor: item.sterne >= 2 ? "yellow" : "default" }} size="small" onClick={() => {
                                                                fetch(`${backend}/users/${loggedInUser}/items/${item.id}/update/sterne/2`, {
                                                                    method: 'PUT',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                })
                                                                    .then(async res => {
                                                                        const data = await res.json()
                                                                        if (!res.ok) {
                                                                            alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                                            return null
                                                                        }
                                                                        return data
                                                                    })
                                                                    .then(data => { if (data) setListe(data) })
                                                            }}>{item.sterne >= 2 ? <StarIcon /> : <StarBorderIcon />}</Fab>

                                                            <Fab sx={{ backgroundColor: item.sterne >= 3 ? "yellow" : "default" }} size="small" onClick={() => {
                                                                fetch(`${backend}/users/${loggedInUser}/items/${item.id}/update/sterne/3`, {
                                                                    method: 'PUT',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                })
                                                                    .then(async res => {
                                                                        const data = await res.json()
                                                                        if (!res.ok) {
                                                                            alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                                            return null
                                                                        }
                                                                        return data
                                                                    })
                                                                    .then(data => { if (data) setListe(data) })
                                                            }}>{item.sterne >= 3 ? <StarIcon /> : <StarBorderIcon />}</Fab>

                                                            <Fab sx={{ backgroundColor: item.sterne >= 4 ? "yellow" : "default" }} size="small" onClick={() => {
                                                                fetch(`${backend}/users/${loggedInUser}/items/${item.id}/update/sterne/4`, {
                                                                    method: 'PUT',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                })
                                                                    .then(async res => {
                                                                        const data = await res.json()
                                                                        if (!res.ok) {
                                                                            alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                                            return null
                                                                        }
                                                                        return data
                                                                    })
                                                                    .then(data => { if (data) setListe(data) })
                                                            }}>{item.sterne >= 4 ? <StarIcon /> : <StarBorderIcon />}</Fab>

                                                            <Fab sx={{ backgroundColor: item.sterne >= 5 ? "yellow" : "default" }} size="small" onClick={() => {
                                                                fetch(`${backend}/users/${loggedInUser}/items/${item.id}/update/sterne/5`, {
                                                                    method: 'PUT',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                })
                                                                    .then(async res => {
                                                                        const data = await res.json()
                                                                        if (!res.ok) {
                                                                            alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                                            return null
                                                                        }
                                                                        return data
                                                                    })
                                                                    .then(data => { if (data) setListe(data) })
                                                            }}>{item.sterne >= 5 ? <StarIcon /> : <StarBorderIcon />}</Fab>
                                                        </Box>
                                                    </td>
                                                    <td style={{ width: "10%", textAlign: "center", padding: "8px", border: '1px solid black' }}> {/* Status*/}
                                                        <Fab sx={{ backgroundColor: item.status === "watched" ? "lime" : "default" }} variant="extended" onClick={() => {
                                                            fetch(`${backend}/users/${loggedInUser}/items/${item.id}/update/status/0`, {
                                                                method: 'PUT',
                                                                headers: { 'Content-Type': 'application/json' },
                                                            })
                                                                .then(async res => {
                                                                    const data = await res.json()
                                                                    if (!res.ok) {
                                                                        alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                                        return null
                                                                    }
                                                                    return data
                                                                })
                                                                .then(data => { if (data) setListe(data) })
                                                        }}>
                                                            {item.status === "watched" ? "Geschaut" : "Nicht Geschaut"}
                                                        </Fab>
                                                    </td>
                                                    <td style={{ width: "5%", textAlign: "center", padding: "8px", border: '1px solid black' }}> {/* Löschen*/}
                                                        <Fab sx={{ backgroundColor: "red" }} onClick={() => {
                                                            fetch(`${backend}/users/${loggedInUser}/items/${item.id}/delete`, {
                                                                method: 'DELETE',
                                                                headers: { 'Content-Type': 'application/json' },
                                                            })
                                                                .then(async res => {
                                                                    const data = await res.json()
                                                                    if (!res.ok) {
                                                                        alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                                        return null
                                                                    }
                                                                    return data
                                                                })
                                                                .then(data => { if (data) setListe(data) })
                                                        }}>
                                                            <DeleteIcon />
                                                        </Fab>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    : ""}
                            </>
                        </>
                    ) : (
                        <> {/* Edit Page */}
                            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', '& > :not(style)': { m: 1 } }}>
                                <h1>Nutzerdaten</h1>
                                <br />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Change Username:
                                    <TextField autoComplete="off" disabled={!enableEditUsername} value={editUsername} onChange={(e) => {
                                        setEditUsername(e.target.value)
                                    }} />
                                    <Fab onClick={() => {
                                        if (enableEditUsername) {
                                            setEnableEditUsername(false)
                                            fetch(`${backend}/users/${loggedInUser}/edit/username`, {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ send: editUsername })
                                            })
                                                .then(async res => {
                                                    const data = await res.json()
                                                    if (!res.ok) {
                                                        alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                        setEditUsername(loggedInUser)
                                                        return null
                                                    }
                                                    return data
                                                })
                                                .then(data => {
                                                    if (data) {
                                                        console.log(data)
                                                        setLoggedInUser(data)
                                                        alert("Username wurde erfolgreich geändert!")
                                                    }
                                                })
                                        } else setEnableEditUsername(true)
                                    }}>{enableEditUsername ? <CheckIcon /> : <EditIcon />}</Fab>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Change Email:
                                    <TextField autoComplete="off" disabled={!enableEditEmail} value={editEmail} onChange={(e) => {
                                        setEditEmail(e.target.value)
                                    }} />
                                    <Fab onClick={() => {
                                        if (enableEditEmail) {
                                            setEnableEditEmail(false)
                                            fetch(`${backend}/users/${loggedInUser}/edit/email`, {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ send: editEmail })
                                            })
                                                .then(async res => {
                                                    const data = await res.json()
                                                    if (!res.ok) {

                                                        fetch(`${backend}/users/${loggedInUser}/email`)
                                                            .then(async res => {
                                                                const data = await res.json()
                                                                if (!res.ok) {
                                                                    alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                                    return null
                                                                }
                                                                return data
                                                            })
                                                            .then(data => {
                                                                if (data) {
                                                                    setEditEmail(data)
                                                                }
                                                            })
                                                        alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                        return null
                                                    }
                                                    return data
                                                })
                                                .then(data => {
                                                    if (data) {
                                                        console.log(data)
                                                        alert("Email wurde erfolgreich geändert!")
                                                    }
                                                })
                                        } else setEnableEditEmail(true)
                                    }}>{enableEditEmail ? <CheckIcon /> : <EditIcon />}</Fab>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Change Password:
                                    <TextField autoComplete="off" type="text" label="Altes Passwort" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                                    <TextField autoComplete="off" type="text" label="Neues Passwort" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <TextField autoComplete="off" type="text" label="Neues Passwort wiederholen" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                                    {oldPassword !== "" || password !== "" || repeatPassword !== "" ? <>
                                        <Fab onClick={() => {
                                            if (oldPassword.trim() !== "" && password.trim() !== "" && repeatPassword.trim() !== "") {
                                                const passwords = { oldPassword, password, repeatPassword }
                                                fetch(`${backend}/users/${loggedInUser}/edit/password`, {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(passwords)
                                                })
                                                    .then(async res => {
                                                        const data = await res.json()
                                                        if (!res.ok) {
                                                            alert("Es ist ein Fehler aufgetreten: " + data.message)
                                                            setRepeatPassword("")
                                                            return null
                                                        }
                                                        return data
                                                    })
                                                    .then(data => {
                                                        if (data) {
                                                            console.log(data)
                                                            alert(data.message)
                                                            setOldPassword("")
                                                            setPassword("")
                                                            setRepeatPassword("")
                                                        }
                                                    })
                                            } else alert("Bitte gebe in alle drei Feler etwas ein!")
                                        }}><CheckIcon /></Fab>
                                    </> : ""}
                                </Box>

                                <Fab onClick={() => {
                                    setEdit(false)
                                }}><ArrowBackIosIcon />
                                </Fab>
                            </Box>
                        </>
                    )}
                </>
            )}
        </div>
    );
}