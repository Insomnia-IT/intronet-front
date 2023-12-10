/**
 *
 * @param e {MouseEvent<HTMLElement>}
 */
function togglePasswordType(e) {
  e.preventDefault();
  e.stopPropagation();
  const field = document.querySelector('#password');
  field.type = field.type === 'password' ? 'text' : 'password';
  // e.target.toggleAttribute('show');
}
