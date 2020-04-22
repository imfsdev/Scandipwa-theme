import React from 'react';
import Link from 'Component/Link/Link.component';
import SourceFooter from 'SourceComponent/Footer/Footer.component';
import './Footer.style';
import twitter from '../../../../media/twitter.png';
import instagram from '../../../../media/instagram.png';

export * from 'SourceComponent/Footer/Footer.component';

class Footer extends SourceFooter {
    renderSocial() {
        return (
            <div>
                <Link
                    block="Footer"
                    elem="Link"
                    to="/page/privacy-policy-cookie-restriction-mode"
                >
                    <img src={twitter} />
                </Link>
                <Link
                    block="Footer"
                    elem="Link"
                    to="/page/terms-and-conditions"
                >
                    <img src={instagram} />
                </Link>
            </div>
        );
    }

    render() {
        const copyright = 'Brandy Melville © 2020. All rights reserved.';

        return (
            <footer block="Footer" aria-label="Footer">
                <span block="Footer" elem="Copyright">
                    {copyright}
                </span>
                {this.renderSocial()}
            </footer>
        );
    }
}

export default Footer;
