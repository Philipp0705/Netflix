import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
const port = 3001

interface liste {
    serie: string,
    status: string,
    kategorie: string,
    sterne: number,
    favorit: boolean,
    id: number,
}

interface user {
    id: number,
    username: string,
    email: string,
    password: string,
    liste: liste[]
}

const accounts: user[] = []

app.use(cors())
app.use(express.json())

app.get('/users', (req, res) => {
    return res.json(accounts)
})

app.post('/login', (req, res) => {
    const { username, password } = req.body

    const findAccount = accounts.findIndex(item => item.username === username)
    if (findAccount === -1) {
        console.log("Es wurde kein Account mit diesem Nutzernamen gefunden!")
        return res.status(404).json({ message: "Es wurde kein Account mit diesem Nutzernamen gefunden!" })
    }
    if (accounts[findAccount].password !== password) {
        console.log("Das Passwort ist nicht korrekt!")
        return res.status(404).json({ message: "Das Passwort ist nicht korrekt!" })
    }
    console.log("Erfolgreicher Login von User:", username)
    return res.status(200).json({ user: username, status: true, message: "Login erfolgreich!" })
})

app.post('/register', (req, res) => {
    const { username, email, password, repeatPassword } = req.body

    if (accounts.find(user => user.username === username)) { //Username bereits vergeben
        console.log("Nutzername existiert bereits")
        return res.status(404).json({ message: "Dieser Nutzername existiert bereits" })
    }

    if (accounts.find(user => user.email === email)) { //E-Mail bereits vergeben
        console.log("E-Mail existiert bereits")
        return res.status(404).json({ message: "Diese E-Mail hat bereits einen Account" })
    }

    if (!email.includes("@")) { //E-Mail ist ungültig
        console.log("E-Mail ist ungültig")
        return res.status(404).json({ message: "E-Mail ist ungültig" })
    }

    if (password !== repeatPassword) { //Passwörter sind nicht identisch
        console.log("Passwörter sind nicht identisch")
        return res.status(404).json({ message: "Passwörter sind nicht identisch" })
    }

    if (password.length < 8) { //Passwort ist zu kurz
        console.log("Passwort muss mindestens 8 Zeichen enthalten")
        return res.status(404).json({ message: "Passwort muss mindestens 8 Zeichen enthalten" })
    }

    const newId = accounts.length > 0 ? Math.max(...accounts.map(item => item.id)) + 1 : 1
    const newUser = { id: newId, username, email, password, liste: [] }
    accounts.push(newUser)
    console.log("Erfolgreiche Registrierung von neuem Nutzer:", username)
    return res.status(200).json({ message: "Registrierung erfolgreich" })
})

app.get('/users/:user/items', (req, res) => {
    const user = req.params.user
    const accountIndex = accounts.findIndex(item => item.username === user)
    if (accountIndex === -1) {
        return res.status(404).json({ message: "Es wurde kein Account gefunden!" })
    }
    console.log(accounts[accountIndex].liste)
    return res.status(200).json(accounts[accountIndex].liste)
})

app.post('/users/:user/items', (req, res) => {
    const user = req.params.user
    const { serie, kategorie } = req.body
    const accountIndex = accounts.findIndex(item => item.username === user)

    if (accountIndex === -1) {
        console.log("Es wurde kein Account gefunden")
        return res.status(400).json({ message: "Es wurde kein Account gefunden" })
    }

    const userListe = accounts[accountIndex].liste

    if (serie.trim() === "") {
        console.log("Serienname ist nicht gültig")
        return res.status(400).json({ message: "Serienname ist nicht gültig" })
    }

    if (userListe.find(item => item.serie === serie)) {
        console.log("Serie existiert bereits")
        return res.status(400).json({ message: "Serie existiert bereits" })
    }

    const newId = userListe.length > 0 ? Math.max(...userListe.map(item => item.id)) + 1 : 1
    const newSerie = { serie, status: "unwatched", kategorie, favorit: false, id: newId, sterne: 0 }
    accounts[accountIndex].liste.push(newSerie)

    console.log(user, " => Neue Serie added: ", newSerie)
    return res.json(accounts[accountIndex].liste)
})

app.put('/users/:user/items/:id/update/:what/:sterne', (req, res) => {
    const user = req.params.user
    const id = Number(req.params.id)
    const what = req.params.what
    const sterne = Number(req.params.sterne)

    const accountIndex = accounts.findIndex(item => item.username === user)

    if (accountIndex === -1) {
        console.log("Es wurde kein Account gefunden")
        return res.status(404).json({ message: "Es wurde kein Account gefunden" })
    }

    const userListe = accounts[accountIndex].liste
    const serieIndex = userListe.findIndex(item => item.id === id)

    if (serieIndex === -1) {
        console.log("Es wurde keine Serie mit dieser ID gefunden")
        return res.status(404).json({ message: "Es wurde keine Serie mit dieser ID gefunden" })
    }

    const selectedSerie = userListe[serieIndex]

    const updatedSerie = what === "favorit" ? {...selectedSerie, favorit: selectedSerie.favorit ? false : true} : //Update Favorit
    what === "status" ? {...selectedSerie, status: selectedSerie.status === "watched" ? "unwatched" : "watched"} : //Update Status
    what === "sterne" ? {...selectedSerie, sterne: selectedSerie.sterne === sterne ? 0 : sterne} : //Update Sterne
    what === "serie" ? {...selectedSerie, serie: `${req.body.text}`} : //Update Serie
    what === "kategorie" ? {...selectedSerie, kategorie: `${req.body.text}`} : //Update Kategorie
    selectedSerie

    userListe[serieIndex] = updatedSerie
    accounts[accountIndex].liste = userListe

    return res.status(200).json(userListe)
})

app.delete('/users/:user/items/:id/delete', (req, res) => {
    const user = req.params.user
    const id = Number(req.params.id)

    const accountIndex = accounts.findIndex(item => item.username === user)

    if (accountIndex === -1) {
        console.log("Es wurde kein Account gefunden")
        return res.status(404).json({message:"Es wurde kein Account gefunden"})
    }

    const userListe = accounts[accountIndex].liste
    const serieIndex = userListe.findIndex(item => item.id === id)

    if (serieIndex === -1) {
        console.log("Es wurde keine Serie mit dieser ID gefunden")
        return res.status(404).json({message:"Es wurde keine Serie mit dieser ID gefunden"})
    }

    userListe.splice(serieIndex, 1)
    accounts[accountIndex].liste = userListe

    return res.status(200).json(userListe)
})

app.put('/users/:user/edit/:what', (req, res) => {
    const user = req.params.user
    const what = req.params.what

    if (what === "username") {
        
    } else if (what === "email") {

    }
})

app.listen(port, () => {
    console.log(`Server hostet on Port ${port}`)
})