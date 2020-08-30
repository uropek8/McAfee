const plugin = {}

function _createModal(options) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.insertAdjacentHTML('afterbegin', options.html);
    // const modals = document.querySelector('.modals');
    // modals.appendChild(modal);
    document.body.appendChild(modal);
    return modal;
}

plugin.modal = function(options) {
    const ANIM_SPEED = 200;
    const $modal = _createModal(options);
    let isClose = false;
    let isDestroyed = false;

    // window.addEventListener('scroll', () => {
    //     document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    // });

    const modal = {
        open() {
            if (isDestroyed) {
                return console.log('Modal is destroyed.');
            }
            document.body.classList.add('active-modal');
            const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}`;

            
            !isClose && $modal.classList.add('active');
        },
        close() {
            isClose = true;
            $modal.classList.remove('active');
            $modal.classList.add('hidden');
            setTimeout(() => {
                $modal.classList.remove('hidden');
                isClose = false;
            }, ANIM_SPEED);
            document.body.classList.remove('active-modal');
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }

    const listener = e => {
        if (e.target.dataset.close) {
            modal.close();
        }
    }

    $modal.addEventListener('click', listener);

    return modal;
}