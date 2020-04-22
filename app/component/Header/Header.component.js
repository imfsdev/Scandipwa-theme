import React from 'react';
import Link from 'Component/Link/Link.component';
import ClickOutside from 'Component/ClickOutside/ClickOutside.component';
import MyAccountOverlay from 'Component/MyAccountOverlay';
import CartOverlay from 'Component/CartOverlay';
import MenuOverlay from 'Component/MenuOverlay';
import SourceHeader from 'SourceComponent/Header/Header.component';
import './Header.style';
import logo from '../../../../media/logo.png';

export * from 'SourceComponent/Header/Header.component';

class Header extends SourceHeader {
    renderLogo(isVisible = false) {
        const { isLoading } = this.props;

        if (isLoading) return null;

        return (
            <Link
                to="/"
                aria-label="Go to homepage by clicking on ScandiPWA logo"
                aria-hidden={!isVisible}
                tabIndex={isVisible ? 0 : -1}
                block="Header"
                elem="LogoWrapper"
                mods={{ isVisible }}
                key="logo"
            >
                <h3>
                    Brandy <img src={logo} /> Melville
                </h3>
            </Link>
        );
    }

    renderMenuButton(isVisible = false) {
        const { onMenuOutsideClick, onMenuButtonClick } = this.props;

        return (
            <ClickOutside onClick={onMenuOutsideClick} key="menu">
                <div>
                    <button
                        block="Header"
                        elem="Button"
                        mods={{ isVisible, type: 'menu' }}
                        aria-label="Go to menu and search"
                        aria-hidden={!isVisible}
                        tabIndex={isVisible ? 0 : -1}
                        onClick={onMenuButtonClick}
                    />
                    <MenuOverlay />
                </div>
            </ClickOutside>
        );
    }

    renderAccountButton(isVisible = false) {
        const { onMyAccountOutsideClick, onMyAccountButtonClick } = this.props;

        return (
            <ClickOutside onClick={onMyAccountOutsideClick} key="account">
                <div aria-label="My account">
                    <button
                        block="Header"
                        elem="Button"
                        mods={{ isVisible, type: 'account' }}
                        onClick={onMyAccountButtonClick}
                        aria-label="Open my account"
                    />
                    <MyAccountOverlay />
                </div>
            </ClickOutside>
        );
    }

    renderMinicartButton(isVisible = false) {
        const { onMinicartOutsideClick, onMinicartButtonClick } = this.props;
        const { onMyAccountOutsideClick, onMyAccountButtonClick } = this.props;
        return (
            <>
                <button
                    block="Header"
                    elem="Button"
                    mods={{ isVisible, type: 'signin' }}
                    onClick={onMyAccountButtonClick}
                    aria-label="Open my account"
                >
                    Sign In
                </button>
                <ClickOutside onClick={onMinicartOutsideClick} key="minicart">
                    <div
                        block="Header"
                        elem="Button"
                        mods={{ isVisible, type: 'minicart' }}
                    >
                        <button
                            onClick={onMinicartButtonClick}
                            aria-label="Minicart"
                            block="Header"
                            elem="MinicartButton"
                        >
                            {this.renderMinicartItemsQty()}
                        </button>
                        <CartOverlay />
                    </div>
                </ClickOutside>
            </>
        );
    }

    render() {
        const {
            navigationState: { name },
        } = this.props;
        const isHiddenOnMobile = false;

        return (
            <header block="Header" mods={{ name, isHiddenOnMobile }}>
                <nav block="Header" elem="Nav">
                    {this.renderNavigationState().map((state) =>
                        state && state.key !== 'logo' && state.key !== 'title'
                            ? state
                            : null
                    )}
                </nav>
                {this.renderNavigationState().map((state) =>
                    state && state.key === 'logo' ? state : null
                )}
            </header>
        );
    }
}

export default Header;
