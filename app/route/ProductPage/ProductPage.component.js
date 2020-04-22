import React, { createRef } from 'react';
import SourceProductPage from 'SourceRoute/ProductPage/ProductPage.component';
import ProductGallery from 'SourceComponent/ProductGallery';
import ProductActions from 'SourceComponent/ProductActions';
import ProductWishlistButton from 'Component/ProductWishlistButton';
import ProductLinks from 'Component/ProductLinks';

import { RELATED } from 'Store/LinkedProducts/LinkedProducts.reducer';

export * from 'SourceRoute/ProductPage/ProductPage.component';

class ProductPage extends SourceProductPage {
    configurableOptionsRef = createRef();

    groupedProductsRef = createRef();

    onConfigurableProductError = this.onProductError.bind(
        this,
        this.configurableOptionsRef
    );

    onGroupedProductError = this.onProductError.bind(
        this,
        this.groupedProductsRef
    );

    onProductError(ref) {
        if (!ref) return;
        const { current } = ref;

        current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });

        current.classList.remove('animate');
        // eslint-disable-next-line no-unused-expressions
        current.offsetWidth; // trigger a DOM reflow
        current.classList.add('animate');
    }

    renderTitle() {
        const { dataSource, quantity, configurableVariantIndex } = this.props;

        return (
            <div block="ProductPage" elem="TitleSection">
                <p key="title" block="ProductPage" elem="Title">
                    {dataSource.name}
                </p>
                <ProductWishlistButton
                    product={dataSource}
                    quantity={quantity}
                    configurableVariantIndex={configurableVariantIndex}
                    onProductValidationError={this.onProductValidationError}
                />
            </div>
        );
    }

    onProductValidationError = (type) => {
        switch (type) {
            case CONFIGURABLE:
                this.onConfigurableProductError();
                break;
            case GROUPED:
                this.onGroupedProductError();
                break;
            default:
                break;
        }
    };

    renderProductPageContent() {
        const {
            configurableVariantIndex,
            parameters,
            getLink,
            dataSource,
            updateConfigurableVariant,
            productOrVariant,
            areDetailsLoaded,
        } = this.props;

        return (
            <>
                <ProductGallery product={productOrVariant} />
                <div block="ProductPage" elem="DetailWrapper">
                    {this.renderTitle()}
                    <ProductActions
                        getLink={getLink}
                        updateConfigurableVariant={updateConfigurableVariant}
                        product={dataSource}
                        parameters={parameters}
                        areDetailsLoaded={areDetailsLoaded}
                        configurableVariantIndex={configurableVariantIndex}
                    />
                </div>
            </>
        );
    }

    renderAdditionalSections() {
        const { areDetailsLoaded } = this.props;

        return (
            <ProductLinks
                linkType={RELATED}
                title={__('You may also like')}
                areDetailsLoaded={areDetailsLoaded}
            />
        );
    }
}

export default ProductPage;
