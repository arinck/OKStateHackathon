import { root } from "./elements.js";

export async function signinPageView() {
    const response = await fetch('/template/reach_login.html',
        {cache: 'no-store'}
    );

    const divWrapper = document.createElement('div');
    divWrapper.classList.add('m-4', 'p-4', 'row');
    divWrapper.innerHTML = await response.text();

    // attach form submit event listener
    const form = divWrapper.getElementsByTagName('form')[0];
    //form.onsubmit = ;

    root.innerHTML = ''; // clear current page rendering
    root.appendChild(divWrapper);
}