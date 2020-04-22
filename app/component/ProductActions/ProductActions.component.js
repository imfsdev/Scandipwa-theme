/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-array-index-key */
// Disabled due placeholder needs

import { PureComponent, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';

import ProductConfigurableAttributes from 'Component/ProductConfigurableAttributes';
import ProductWishlistButton from 'Component/ProductWishlistButton';
import GroupedProductList from 'Component/GroupedProductsList';
import TextPlaceholder from 'Component/TextPlaceholder';
import ProductPrice from 'Component/ProductPrice';
import { ProductType } from 'Type/ProductList';
import AddToCart from 'Component/AddToCart';
import { GROUPED, CONFIGURABLE } from 'Util/Product';
import isMobile from 'Util/Mobile';
import Html from 'Component/Html';

import ProductCard from 'Component/ProductCard';
import ExpandableContent from 'Component/ExpandableContent';
import ProductAttributeValue from 'Component/ProductAttributeValue';
import { RELATED, UPSELL } from 'Store/LinkedProducts/LinkedProducts.reducer';

import arrowLeft from '../../../../media/arrow_left.png';
import arrowRight from '../../../../media/arrow_right.png';

import './ProductActions.style';

/**
 * Product actions
 * @class ProductActions
 */
export default class ProductActions extends PureComponent {
    static propTypes = {
        product: ProductType.isRequired,
        minQuantity: PropTypes.number.isRequired,
        maxQuantity: PropTypes.number.isRequired,
        configurableVariantIndex: PropTypes.number,
        showOnlyIfLoaded: PropTypes.func.isRequired,
        quantity: PropTypes.number.isRequired,
        areDetailsLoaded: PropTypes.bool.isRequired,
        getLink: PropTypes.func.isRequired,
        setQuantity: PropTypes.func.isRequired,
        updateConfigurableVariant: PropTypes.func.isRequired,
        parameters: PropTypes.objectOf(PropTypes.string).isRequired,
        getIsConfigurableAttributeAvailable: PropTypes.func.isRequired,
        groupedProductQuantity: PropTypes.objectOf(PropTypes.number).isRequired,
        clearGroupedProductQuantity: PropTypes.func.isRequired,
        setGroupedProductQuantity: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            active: 0,
        };
    }

    static defaultProps = {
        configurableVariantIndex: 0,
        numberOfProductsToDisplay: 3,
    };

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

    renderSkuAndStock() {
        const {
            product,
            product: { variants },
            configurableVariantIndex,
            showOnlyIfLoaded,
        } = this.props;

        const productOrVariant =
            variants && variants[configurableVariantIndex] !== undefined
                ? variants[configurableVariantIndex]
                : product;

        const { sku, stock_status } = productOrVariant;

        return (
            <section
                block="ProductActions"
                elem="Section"
                mods={{ type: 'sku' }}
                aria-label="Product SKU and availability"
            >
                {showOnlyIfLoaded(
                    sku,
                    <>
                        <span block="ProductActions" elem="Sku" itemProp="sku">
                            {`SKU: ${sku}`}
                        </span>
                        <span block="ProductActions" elem="Stock">
                            {stock_status === 'OUT_OF_STOCK'
                                ? __('Out of stock')
                                : __('In stock')}
                        </span>
                    </>,
                    <TextPlaceholder />
                )}
            </section>
        );
    }

    renderConfigurableAttributes(type) {
        const {
            getLink,
            updateConfigurableVariant,
            parameters,
            areDetailsLoaded,
            product: { configurable_options, type_id },
            getIsConfigurableAttributeAvailable,
        } = this.props;

        if (type_id !== 'configurable') return null;

        return (
            <div
                ref={this.configurableOptionsRef}
                block="ProductActions"
                elem="AttributesWrapperType"
            >
                <ProductConfigurableAttributes
                    // eslint-disable-next-line no-magic-numbers
                    numberOfPlaceholders={[2, 4]}
                    mix={{ block: 'ProductActions', elem: 'Attributes' }}
                    isReady={areDetailsLoaded}
                    getLink={getLink}
                    parameters={parameters}
                    updateConfigurableVariant={updateConfigurableVariant}
                    configurable_options={configurable_options}
                    getIsConfigurableAttributeAvailable={
                        getIsConfigurableAttributeAvailable
                    }
                    type={type}
                    isContentExpanded
                />
            </div>
        );
    }

    renderShortDescriptionContent() {
        const {
            product: { short_description, id },
        } = this.props;
        const { html } = short_description || {};

        if (!html && id) return null;

        const htmlWithItemProp = `<div itemProp="description">${html}</div>`;

        return (
            <div block="ProductActions" elem="ShortDescription">
                {html ? (
                    <Html content={htmlWithItemProp} />
                ) : (
                    <p>
                        <TextPlaceholder length="long" />
                    </p>
                )}
            </div>
        );
    }

    renderShortDescription() {
        const {
            product: { short_description, id },
        } = this.props;
        const { html } = short_description || {};

        if (!html && id && isMobile.any()) return null;

        return (
            <section
                block="ProductActions"
                elem="Section"
                mods={{ type: 'short' }}
                aria-label="Product short description"
            >
                {this.renderShortDescriptionContent()}
            </section>
        );
    }

    renderNameAndBrand() {
        const {
            product: {
                name,
                attributes: { brand: { attribute_value: brand } = {} } = {},
            },
            showOnlyIfLoaded,
        } = this.props;

        return (
            <section
                block="ProductActions"
                elem="Section"
                mods={{ type: 'name' }}
            >
                {showOnlyIfLoaded(
                    brand,
                    <h4 block="ProductActions" elem="Brand" itemProp="brand">
                        <TextPlaceholder content={brand} />
                    </h4>
                )}
                <p block="ProductActions" elem="Title" itemProp="name">
                    <TextPlaceholder content={name} length="medium" />
                </p>
            </section>
        );
    }

    renderQuantityInput() {
        const {
            quantity,
            setQuantity,
            product: { type_id },
        } = this.props;

        if (type_id === GROUPED) return null;

        let quantities = [];
        for (let i = 1; i <= 3; i++) {
            quantities.push(i);
        }

        return (
            <select
                onChange={setQuantity}
                mix={{ block: 'ProductActions', elem: 'Qty' }}
            >
                {quantities.map((q) => (
                    <option selected={q == quantity}>{q}</option>
                ))}
            </select>
        );
    }

    renderAddToCart() {
        const {
            configurableVariantIndex,
            product,
            quantity,
            groupedProductQuantity,
        } = this.props;

        return (
            <AddToCart
                product={product}
                configurableVariantIndex={configurableVariantIndex}
                mix={{ block: 'ProductActions', elem: 'AddToCart' }}
                quantity={quantity}
                groupedProductQuantity={groupedProductQuantity}
                onProductValidationError={this.onProductValidationError}
            />
        );
    }

    renderPrice() {
        const {
            product: { price, variants, type_id },
            configurableVariantIndex,
        } = this.props;

        if (type_id === GROUPED) return null;

        const productOrVariantPrice =
            variants && variants[configurableVariantIndex] !== undefined
                ? variants[configurableVariantIndex].price
                : price;

        return (
            <ProductPrice
                price={productOrVariantPrice}
                mix={{ block: 'ProductActions', elem: 'Price' }}
            />
        );
    }

    renderProductWishlistButton() {
        const { product, quantity, configurableVariantIndex } = this.props;

        return (
            <ProductWishlistButton
                product={product}
                quantity={quantity}
                configurableVariantIndex={configurableVariantIndex}
                onProductValidationError={this.onProductValidationError}
            />
        );
    }

    renderGroupedItems() {
        const {
            product,
            product: { type_id },
            groupedProductQuantity,
            setGroupedProductQuantity,
            clearGroupedProductQuantity,
        } = this.props;

        if (type_id !== GROUPED) return null;

        return (
            <div
                block="ProductActions"
                elem="GroupedItems"
                ref={this.groupedProductsRef}
            >
                <GroupedProductList
                    product={product}
                    clearGroupedProductQuantity={clearGroupedProductQuantity}
                    groupedProductQuantity={groupedProductQuantity}
                    setGroupedProductQuantity={setGroupedProductQuantity}
                />
            </div>
        );
    }

    renderMaterial() {
        const {
            product: {
                attributes: { material },
            },
        } = this.props;

        if (!material) return null;

        return (
            <div block="ProductActions" elem="Material">
                <span>
                    <b>Fabrics: </b>
                    {material.attribute_value}
                </span>
            </div>
        );
    }

    renderDescription() {
        const {
            product: { description: { html } = {} },
        } = this.props;

        if (!html) {
            return null;
        }

        return (
            <div>
                <Html content={html} />
            </div>
        );
    }

    renderAttribute = ([attributeLabel, valueLabel]) => (
        <Fragment key={attributeLabel}>
            <dt block="ProductInformation" elem="AttributeLabel">
                {attributeLabel}
            </dt>
            <dd block="ProductInformation" elem="ValueLabel">
                <ProductAttributeValue
                    key={attributeLabel}
                    attribute={valueLabel}
                    isFormattedAsText
                />
            </dd>
        </Fragment>
    );

    renderAttributes() {
        const {
            product: { attributes = {}, parameters = {} },
        } = this.props;

        const allAttribsWithValues = Object.entries(attributes).reduce(
            (acc, [key, val]) => {
                const { attribute_label, attribute_value } = val;
                if (attribute_value) return { ...acc, [attribute_label]: val };

                const valueIndexFromParameter = parameters[key];
                if (valueIndexFromParameter) {
                    return {
                        ...acc,
                        [attribute_label]: {
                            ...val,
                            attribute_value: valueIndexFromParameter,
                        },
                    };
                }

                return acc;
            },
            {}
        );

        if (!Object.keys(allAttribsWithValues).length) {
            return null;
        }

        return (
            <dl block="ProductInformation" elem="Attributes">
                {Object.entries(allAttribsWithValues).map(this.renderAttribute)}
            </dl>
        );
    }

    renderProductInformation() {
        return (
            <ExpandableContent
                heading={__('More Info')}
                mix={{ block: 'ProductInformation', elem: 'Content' }}
            >
                {this.renderDescription()}
                {this.renderAttributes()}
            </ExpandableContent>
        );
    }

    get productItems() {
        const linkType = RELATED;
        const {
            linkedProducts: {
                [linkType]: { items },
            },
        } = this.props;

        return items;
    }

    renderProductCard(product, i) {
        const { id = i } = product;

        return (
            <ProductCard
                block="ProductLinks"
                elem="Card"
                product={product}
                key={id}
            />
        );
    }

    renderItems() {
        let items = [];

        const { numberOfProductsToDisplay } = this.props;

        if (!this.productItems) {
            return Array.from({ length: numberOfProductsToDisplay }, (_, i) =>
                this.renderProductCard({}, i)
            );
        }

        for (let i = this.state.active; i < this.state.active + 4; i++) {
            let index = i;
            if (i < 0) {
                index = this.productItems.length + i;
            } else if (i >= this.productItems.length) {
                index = i % this.productItems.length;
            }

            items.push(
                <ProductCard
                    block="ProductLinks"
                    elem="Card"
                    product={this.productItems[index]}
                    key={i}
                />
            );
        }

        return items;
    }

    handleLeft = () => {
        const newActive = this.state.active;
        newActive--;

        this.setState({
            active: newActive < 0 ? this.productItems.length - 1 : newActive,
        });
    };

    handleRight = () => {
        const newActive = this.state.active;
        this.setState({
            active: (newActive + 1) % this.productItems.length,
        });
    };

    renderMoreColors() {
        const { areDetailsLoaded } = this.props;

        if (!areDetailsLoaded) {
            return null;
        }

        return (
            <ExpandableContent
                heading={__('More Colors')}
                mix={{ block: 'ProductLinks' }}
            >
                <div
                    block="ProductLinks"
                    elem="Arrow"
                    onClick={this.handleLeft}
                >
                    <img src={arrowLeft} alt="arrow_left" />
                </div>
                <ul block="ProductLinks" elem="List">
                    {this.renderItems()}
                </ul>
                <div
                    block="ProductLinks"
                    elem="Arrow"
                    onClick={this.handleRight}
                >
                    <img src={arrowRight} alt="arrow_right" />
                </div>
            </ExpandableContent>
        );
    }

    render() {
        return (
            <article block="ProductActions">
                {this.renderNameAndBrand()}
                {this.renderPrice()}
                {this.renderShortDescription()}
                {this.renderMaterial()}
                {this.renderConfigurableAttributes('size')}
                <div block="ProductActions" elem="AddToCartWrapper">
                    <h4 className="title">QTY:</h4>
                    <div className="wrapper d-flex align-items-center">
                        {this.renderQuantityInput()}
                        {this.renderAddToCart()}
                        {this.renderProductWishlistButton()}
                    </div>
                </div>
                {this.renderSkuAndStock()}
                {this.renderGroupedItems()}
                {this.renderProductInformation()}
                {this.renderMoreColors()}
            </article>
        );
    }
}
