class InitAppPublicationClass {

  constructor() {
    this.btnComments = $('.btn__comments');
    this.formComments = $('.form__comments');
    this.formCollapse = $('.form__collapse');
    this.comentarioInput = $('.comentario-input');
    this.eliminarPublication = $('.eliminar-publication');
    this.token = $('meta[name="csrf-token"]').attr('content');
  }

  showComments() {
    this.btnComments.on('click', (e) => {
      e.preventDefault();
      $(e.currentTarget).closest('.justify-content-end').find('.wrapper-comments').slideToggle();
    })
  }

  collapseComments() {
    this.formCollapse.on('click', (e) => {
      $(e.currentTarget).closest('.justify-content-end').find('.wrapper-comments').slideUp();
    })
  }

  save() {
    this.formComments.on('submit', (e) => {
      e.preventDefault();
      let form = $(e.currentTarget);
      let formData = new FormData(form[0]);  
      $.ajax({
        url: form.attr('action'),
        method: "POST",
        headers: {
          'X-CSRF-TOKEN': this.token,
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          if (response.success) {
            addCommentToList(response.data, form);
            updateCommentCount(form);
            // Vaciar los campos del formulario después de enviar
            form[0].reset();
          }
        }
      });
    });

    function addCommentToList(comment, form) {
      let contenidoHtml = comment.contenido ? `<p>${comment.contenido}</p>` : '<p>No hay contenido</p>';
      let commentHtml = `
        <div class="row row-cols-auto mb-2">
            <div class="col news">
                <img src="${baseUrl}fotoPerfil/${comment.user.fotoPerfil}" 
                    alt="${comment.user.alias}'s profile picture" 
                    class="rounded-circle" width="40" height="40"/>
            </div>
            <div class="col">
                <a href="${baseUrl}usuario/${comment.user.alias}?estado=confirmado">${comment.user.name}</a>
                <p>${contenidoHtml}</p>
                ${comment.imagen ? `<img src="${baseUrl}comentarioImagen/${comment.imagen}" 
                                    alt="Comment Image" 
                                    class="img-fluid" 
                                    style="max-width: 100%; height: auto;">` : ''}
            </div>
        </div>
      `;

      form.before(commentHtml)
    }

    function updateCommentCount(formElement) {

      let commentButton = formElement.closest('.wrapper-comments').prev('.btn__comments');

      if (commentButton.length === 0) {
        console.error('El botón de comentarios no se encuentra en el DOM.');
        return;
      }

      let buttonText = commentButton.text().trim();
      let match = buttonText.match(/\d+/);

      if (!match) {
        console.error('El texto del botón no contiene un número válido.');
        return;
      }

      let currentCount = parseInt(match[0]);
      let newCount = currentCount + 1;
      commentButton.text(`Comentarios (${newCount})`);
    }
  }

  emojis() {
    // Guardamos la referencia a 'this' para usarla en el evento click
    const self = this;
    // Mostrar y ocultar el selector de emojis de manera contextual para cada publicación
    this.formComments.each(function () {
      const form = $(this);
      // Mostrar/ocultar emojis solo dentro del formulario actual
      form.find('#emojiToggle').on('click', function () {
        form.find('.emoji-picker').toggle();
      });
      // Añadir emojis al input de comentario del formulario actual
      form.find('.chat-container__emoji').on('click', function () {
        let comentarioInput = form.find('.comentario-input');
        comentarioInput.val(comentarioInput.val() + $(this).text());
      });
    });
  }

  delete() {
    this.eliminarPublication.on('click', function (e) {
      e.preventDefault();
      $.ajax({
        url: `${$(this).attr('href')}`,
        method: 'GET',
        success: (response) => {
          if (response.message == 'success') {
            $(this).closest('.col-12.mb-3').remove();
            Swal.fire({
              icon: 'success',
              title: 'Publicación eliminada',
              text: 'La publicación ha sido eliminada exitosamente',
              showConfirmButton: false,
              timer: 1800
            })
            
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Solo el autor de la publicación puede borrarla'
            })
          }
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    })
  }

  // Funcionalidades
  startIniPublication() {
    this.showComments();
    this.save();
    this.collapseComments();
    this.emojis();
    this.delete();
  }

}

let initAppPublication = new InitAppPublicationClass();
initAppPublication.startIniPublication();