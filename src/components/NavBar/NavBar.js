import React from 'react';

import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

function NavBar() {

    return (
        <Menu>
            <Menu.Item as={Link} to='/' name='Home' />
            <Menu.Item as={Link} to='/load-game' name='Load Game' />
        </Menu>
    );
}
export default NavBar;