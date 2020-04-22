import React from 'react';
import SourceMenuOverlay from 'SourceComponent/MenuOverlay/MenuOverlay.component';
import Overlay from 'Component/Overlay';

export * from 'SourceComponent/MenuOverlay/MenuOverlay.component';

export const MENU_OVERLAY_KEY = 'menu';

class MenuOverlay extends SourceMenuOverlay {
    render() {
        return (
            <Overlay
              id={ MENU_OVERLAY_KEY }
              mix={ { block: 'MenuOverlay' } }
              onVisible={ this.onVisible }
            >
                { this.renderStoreSwitcher() }
                { this.renderTopLevel() }
            </Overlay>
        );
    }
}

export default MenuOverlay;