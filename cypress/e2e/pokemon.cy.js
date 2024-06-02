describe('template spec', () => {
  it.skip('Validación de ventana inicial', () => {
    cy.visit('http://localhost:8080/')
    cy.get('#Titulo').should('have.text','¿Eres el mejor maestro pokemon del mundo?')
    cy.get('#Subtitulo').should('have.text','Memoriza la mayor cantidad de Pokemons y demuestralo!!')
    cy.get('#Subtitulo2').should('have.text','Equipo elegido para esta ronda:')
    cy.get('#botonIniciarJuego').should('be.visible');
    cy.get('#botonIniciarJuego').click();
    cy.get('#Instrucciones').should('have.text','Para enviar la secuencia de Pokemons da click en el Pokemon deseado, una vez que termines tu secuencia enviala dando click en la Pokebola')
    cy.get('#Instrucciones2').should('have.text','Si te equivocas no pasa nada, solo da click en el pokemon que quieras remover y este será eliminado de la secuencia')
    cy.get('.pokemon-image').should('have.length', 6);
  })

  describe('Secuencia inicial', () => {
  it('La  prueba  deberá  interceptar  la  llamada  realizada  por  el  botón', () => {
    cy.visit('http://localhost:8080/');
  
    // Intercepta la llamada API
    cy.intercept('POST', 'https://poke-memo-app-9528044356ae.herokuapp.com/enviarSecuencia').as('enviarSecuencia');
  
    // Hacer clic en el botón Jugar
    cy.get('#botonIniciarJuego').click();
  
    // Esperar la respuesta de la API y verificar la renderización de la secuencia
    cy.wait('@enviarSecuencia').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      const secuencia = interception.response.body.pokemonSequence;
  
      // Asegurarse de que cada elemento de la secuencia se haya renderizado con el src correcto
      secuencia.forEach((pokemon, index) => {
        cy.get(`[data-cy='secuencia-maquina-${index}']`, { timeout: 10000 }).should('have.attr', 'src', pokemon.imagenUrl);
      });
    });
  })
  it('Debe mostrar Dittos en la secuencia después de 5 segundos', () => {
    cy.visit('http://localhost:8080/');
  
    // Configurar interceptación y establecer un alias para ella
    cy.intercept('POST', 'https://poke-memo-app-9528044356ae.herokuapp.com/enviarSecuencia').as('enviarSecuencia');
  
    // Asegúrate de configurar la interceptación antes de desencadenar la acción que hace la llamada
    cy.get('#botonIniciarJuego').click(); // Suponiendo que esto inicia la secuencia y la llamada de red
  
    // Esperar 5 segundos para que se ejecute `reemplazarSecuenciaMaquina`
    cy.wait(5000);
  
    // Utilizar el alias para esperar a la respuesta de la API
    cy.wait('@enviarSecuencia').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      // Continúa con las verificaciones adicionales aquí
    });
  
    // Ahora, verifica que los Ditto se muestren correctamente
    cy.get("[data-cy^='secuencia-maquina-']").then(($elements) => {
      const totalDittos = $elements.length;
      for (let i = 0; i < totalDittos; i++) {
        cy.get(`[data-cy='secuencia-maquina-${i}']`).should('have.attr', 'src', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png');
      }
    });
  });
  
  
  
})

describe('Creación y envío de secuencia', () => {
  beforeEach(() => {
    // Visita la aplicación
    cy.visit('http://localhost:8080'); // Asegúrate de que la URL sea la correcta para tu aplicación
  });

  it.skip('debe añadir un Pokémon a la secuencia al hacer clic en él', () => {
    // Espera a que el equipo Pokemon esté cargado
    cy.get('.button-container').should('not.contain', 'Cargando equipo Pokemon...');

    // Verifica que el botón de iniciar juego esté presente y haz clic en él
    cy.get('#botonIniciarJuego').click();

    // Espera a que la secuencia a memorizar esté visible
    cy.get('h1').contains('Secuencia a memorizar:').should('be.visible');

    // Verifica que la secuencia a enviar esté visible
    cy.get('h1').contains('Secuencia a enviar:').should('be.visible');
    cy.get('.ImagenesPokemon').should('have.length', 0)
    cy.wait(10000)
    cy.get('.image-button').first().click()
    cy.get('.ImagenesPokemon').should('have.length', 1)
    

  

 
  });

  it.skip('La prueba debe de validar que al dar click en un Pokemon de la secuencia este sea removido ', () => {
    // Espera a que el equipo Pokemon esté cargado
    cy.get('.button-container').should('not.contain', 'Cargando equipo Pokemon...');

    // Verifica que el botón de iniciar juego esté presente y haz clic en él
    cy.get('#botonIniciarJuego').click();

    // Espera a que la secuencia a memorizar esté visible
    cy.get('h1').contains('Secuencia a memorizar:').should('be.visible');

    // Verifica que la secuencia a enviar esté visible
    cy.get('h1').contains('Secuencia a enviar:').should('be.visible');
    cy.get('.ImagenesPokemon').should('have.length', 0)
    cy.wait(10000)
    cy.get('.image-button').first().click()
    cy.get('.ImagenesPokemon').should('have.length', 1)

    cy.get('.secuencia-container .pokemon-image').first().click();
    cy.get('.secuencia-container .pokemon-image').should('have.length', 0);   
  });

  it.skip('La prueba debe validar que el botón de "Enviar Secuencia" aparezca hasta que la cantidad de Pokemons dentro de la secuencia a memorizar y la secuencia a enviar sean iguales. ', () => {
    // Espera a que el equipo Pokemon esté cargado
    cy.get('.button-container').should('not.contain', 'Cargando equipo Pokemon...');

    // Verifica que el botón de iniciar juego esté presente y haz clic en él
    cy.get('#botonIniciarJuego').click();

    // Espera a que la secuencia a memorizar esté visible
    cy.get('h1').contains('Secuencia a memorizar:').should('be.visible');

    // Verifica que la secuencia a enviar esté visible
    cy.get('h1').contains('Secuencia a enviar:').should('be.visible');
    cy.get('.ImagenesPokemon').should('have.length', 0)
    cy.wait(10000)
    
    cy.get('[data-cy^="secuencia-maquina-"]').then($seqMemorizar => {
      const secuenciaAMemorizarLength = $seqMemorizar.length;

      // Agrega Pokémon a la secuencia a enviar uno por uno
      for (let i = 0; i < secuenciaAMemorizarLength; i++) {
        // Haz clic en un Pokémon para añadirlo a la secuencia a enviar
        cy.get('.image-button').eq(i).click();

        // Verifica que el botón de "Enviar Secuencia" no esté visible hasta que las secuencias sean iguales
        if (i < secuenciaAMemorizarLength - 1) {
          cy.get('.play-button').should('not.be.visible');
        }
      }

      // Ahora que las secuencias deberían ser iguales, verifica que el botón de "Enviar Secuencia" sea visible
      cy.get('.play-button').should('be.visible');
    });
  });

  it.skip('La prueba debe de validar que la secuencia sea enviada como parámetro en la petición POST que se llama al dar click en el botón “Enviar secuencia” ', () => {
    // Intercepta la solicitud POST
    cy.intercept('POST', '**/enviarSecuencia').as('enviarSecuencia');

    // Visita la aplicación
    cy.visit('http://localhost:8080'); // Asegúrate de que la URL sea la correcta

    // Verifica que el botón de iniciar juego esté presente y haz clic en él
    cy.get('#botonIniciarJuego').click();

    // Espera a que la secuencia a memorizar esté visible
    cy.get('h1').contains('Secuencia a memorizar:').should('be.visible');

    // Asegura que inicialmente la secuencia a enviar esté vacía
    cy.get('.secuencia-container .pokemon-image').should('have.length', 0);

    // Espera un momento para permitir que la secuencia inicial se cargue (ajusta el tiempo según sea necesario)
    cy.wait(10000);

    // Agrega un solo Pokémon a la secuencia a enviar
    cy.get('.image-button').first().click();

    // Añade el identificador del Pokémon a la secuencia actual
    cy.get('.image-button').first().invoke('attr', 'data-cy').then(dataCy => {
      const index = parseInt(dataCy.split('-')[1]);
      const secuenciaActual = [index + 1]; // Suponiendo que los índices corresponden a los identificadores de los Pokémon

      // Verifica que el botón de "Enviar Secuencia" sea visible
      cy.get('.play-button').should('be.visible');

      // Haz clic en el botón "Enviar Secuencia"
      cy.get('.play-button').click();

      // Espera a que la solicitud POST sea enviada y verifica los parámetros
      cy.wait('@enviarSecuencia').its('request.body').should(body => {
        expect(body).to.have.property('idJuego');
        
      });
    });  
  });
  

    
  });



  describe('Finalización del juego', () => {
    beforeEach(() => {
      // Visita la aplicación
      cy.visit('http://localhost:8080'); // Asegúrate de que la URL sea la correcta para tu aplicación
    });
    it('La  prueba  debe  de  validar  que  al  finalizar  el  juego  aparezca  el  número  de pokemons que el jugador memorizó', () => {
      cy.intercept('POST', '**/enviarSecuencia').as('enviarSecuencia');

      // Visita la aplicación
      cy.visit('http://localhost:8080'); // Asegúrate de que la URL sea la correcta
  
      // Verifica que el botón de iniciar juego esté presente y haz clic en él
      cy.get('#botonIniciarJuego').click();
  
      // Espera un momento para permitir que la secuencia inicial se cargue (ajusta el tiempo según sea necesario)
      cy.wait(10000);
  
      // Agrega un solo Pokémon a la secuencia a enviar
      cy.get('.image-button').first().click();
  
      // Verifica que el botón de "Enviar Secuencia" sea visible y haz clic en él
      cy.get('.play-button').should('be.visible').click();
  
      // Espera a que la solicitud POST sea enviada y responde simulando el fin del juego
      cy.wait('@enviarSecuencia').then(({ response }) => {
        // Simula que el juego ha terminado y que el servidor responde con el puntaje
        
        
        cy.get('h1').contains('GAME OVER').should('be.visible');
        cy.get('#Puntaje').should('contain.text', 'Puntaje: 0')
        // Verifica que aparezca el puntaje en la pantalla de fin del juego
        //cy.get('#Puntaje').contains(`Puntaje: 1`).should('be.visible');
      });  
    });



  });
});


  
