import { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

import ClickOutside from 'Component/ClickOutside';
import SearchOverlay from 'Component/SearchOverlay';

import search from '../../../../media/search.png';
import flag from '../../../../media/flag.png';

import './SearchField.style';

class SearchField extends PureComponent {
    static propTypes = {
        searchCriteria: PropTypes.string,
        onSearchBarClick: PropTypes.func.isRequired,
        onSearchBarChange: PropTypes.func.isRequired,
        onSearchOutsideClick: PropTypes.func.isRequired,
        onClearSearchButtonClick: PropTypes.func.isRequired,
        isVisible: PropTypes.bool,
        isActive: PropTypes.bool,
    };

    static defaultProps = {
        isVisible: true,
        isActive: true,
        searchCriteria: '',
    };

    searchBarRef = createRef();

    state = {
        isPlaceholderVisible: true,
        showPlaceHolder: true,
    };

    static getDerivedStateFromProps(props) {
        const { isActive } = props;
        if (isActive) return null;
        return { isPlaceholderVisible: true };
    }

    onClearSearchButtonClick(isFocusOnSearchBar = true) {
        const { onClearSearchButtonClick } = this.props;
        if (isFocusOnSearchBar) this.searchBarRef.current.focus();
        onClearSearchButtonClick();
    }

    handleChange = (e) => {
        const {
            target: { value },
        } = e;
        const { onSearchBarChange } = this.props;
        onSearchBarChange(e);

        this.setState({ isPlaceholderVisible: value === '' });
    };

    clearSearch = () => {
        this.onClearSearchButtonClick(false);
    };

    renderClearSearch() {
        const { isVisible } = this.props;

        return (
            <button
                block="Header"
                elem="Button"
                onClick={this.onClearSearchButtonClick}
                mods={{
                    type: 'searchClear',
                    isVisible,
                }}
                aria-label="Clear search"
            />
        );
    }

    renderContent() {
        const { searchCriteria, onSearchBarClick, isActive } = this.props;

        const { isPlaceholderVisible, showPlaceHolder } = this.state;

        return (
            <div
                block="SearchField"
                elem="Placeholder"
                mods={{
                    showPlaceHolder,
                }}
            >
                <div className="d-flex align-items-center">
                    <button
                        block="Header"
                        elem="Button"
                        mods={{
                            type: 'flag',
                        }}
                        onClick={() =>
                            this.setState({ showPlaceHolder: false })
                        }
                    >
                        <img src={flag} />
                    </button>
                    <span className="free-shipping">
                        Free shipping for orders over $100!
                    </span>
                </div>
                <div className="d-flex align-items-center">
                    <input
                        id="search-field"
                        placeholder="Search entire store here..."
                        ref={this.searchBarRef}
                        block="SearchField"
                        elem="Input"
                        onClick={onSearchBarClick}
                        onChange={this.handleChange}
                        value={searchCriteria}
                        mods={{ isActive }}
                        autoComplete="off"
                    />
                    <button
                        block="Header"
                        elem="Button"
                        mods={{
                            type: 'search',
                        }}
                        onClick={() =>
                            this.setState({ showPlaceHolder: false })
                        }
                    >
                        <img src={search} />
                    </button>
                </div>
            </div>
        );
    }

    render() {
        const {
            onSearchOutsideClick,
            searchCriteria,
            isVisible,
            isActive,
        } = this.props;

        return (
            <div block="SearchField" mods={{ isVisible, isActive }}>
                <ClickOutside onClick={onSearchOutsideClick}>
                    <div block="SearchField" elem="Wrapper">
                        {this.renderContent()}
                        <SearchOverlay
                            clearSearch={this.clearSearch}
                            searchCriteria={searchCriteria}
                        />
                    </div>
                </ClickOutside>
            </div>
        );
    }
}

export default SearchField;
