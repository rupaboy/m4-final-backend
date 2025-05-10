Iniciar desde carpeta raiz /
'node src/app.mjs' (sin comillas vía terminal)

Dependencias:
    ejs
    ejs-layouts
    method-override
    express-validator
    express
    mongoose


Endpoints GET method:

    /api/
    Home
    /api/countries
    Dashboard
    /api/countries/add
    Agregar país
    /api/countries/edit/:id
    Editar Por Id
    /api/countries/remove/:id
    Borrar Por Id
    /api/countries/:id,
    Ver Por Id 

Endpoints POST method:

    /api/countries/new,
    Crear nuevo país 

Endpoints PUT method:

    /api/countries/set/:id
    Alterar Por Id 

Endpoints DELETE method:

    /api/countries/remove/:id
    Remover por Id 

Endpoints para Desarrollo:

    /api/countries/remove-all (DELETE)
    Borrar todos (/routes/countryRoutes.mjs)
    /restconsumer (GET)
    Borrar todos (app.mjs) 

Descomentar y revisar dependencias en sus archivos respectivos.
Campos:

    countryFlag
    countryName
    countryCapitals
    countryContinents
    countryRegion
    countrySubRegion
    countryBorders
    countryLatLong

    countryArea
    countryPopulation
    countryLanguages
    countryCurrencies
    countryGiniYearLatest
    countryGiniValueLatest
    countryTimezones

Creado por:
Fernando Pais
(Mayo 2025)
geko.informatic@gmail.com

