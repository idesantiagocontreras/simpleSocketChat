class Usuarios {
    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {

        let persona = { id, nombre, sala };
        this.personas.push(persona);
        return this.personas;
    }

    getPersona(id) {
        let persona = this.personas.filter((persona) => persona.id === id)[0];
        return persona;
    }

    searchPersonas(find) {
        let exp = new RegExp(find.toLowerCase());
        let personas = this.personas.filter((persona) => exp.test(persona.nombre.toLowerCase()));
        return personas;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSalas(sala) {
        let personasEnSala = this.personas.filter((persona) => persona.sala === sala);
        return personasEnSala;
    }

    borrarPersona(id) {
        let personaBorrada = this.getPersona(id);

        console.log(personaBorrada);

        this.personas = this.personas.filter(persona => persona.id !== id);
        return personaBorrada;
    }
}

module.exports = { Usuarios };