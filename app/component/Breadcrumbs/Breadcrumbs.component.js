import SourceBreadcrumbs from 'SourceComponent/Breadcrumbs/Breadcrumbs.component';
import './Breadcrumbs.style';

export * from 'SourceComponent/Breadcrumbs/Breadcrumbs.component';

export default class Breadcrumbs extends SourceBreadcrumbs {
    render() {
        return (
            <div className="Menu">
                <div className="M-Link">JUST IN</div>
                <div className="M-Link">BASICS</div>
                <div className="M-Link">CLOTHING</div>
                <div className="M-Link">GRAPHICS</div>
                <div className="M-Link">ACCESSORIES</div>
                <div className="M-Link">GIFT CARDS</div>
                <div className="M-Link">LOOKBOOK</div>
            </div>
        );
    }
}
