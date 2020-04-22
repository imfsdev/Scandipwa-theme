import React from 'react';
import SourceProductInformation from 'SourceComponent/ProductInformation/ProductInformation.component';
import ExpandableContent from 'SourceComponent/ExpandableContent';

import './ProductInformation.style';

export * from 'SourceComponent/ProductInformation/ProductInformation.component';

class ProductInformation extends SourceProductInformation {
    renderContentWrapper() {
        return (
            <ExpandableContent
                heading={__('More info')}
                mix={{ block: 'ProductInformation', elem: 'Content' }}
            >
                {this.renderContent()}
                {this.renderAttributesInfo()}
            </ExpandableContent>
        );
    }
}

export default ProductInformation;
