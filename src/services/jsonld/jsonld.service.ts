import { Injectable,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class JsonLDService {

  static scriptType = 'application/json+ld';
	static websiteSchema = (url?: string, name?: string) => {
		return {
			'@context': 'http://schema.org',
			'@type'      : 'WebSite',
			url          : url || 'https:\/\/google.com',
			name         : name || 'Google',
			"sameAs": ["https://facebook.com/google",
				   "https://instagram.com/google",
				   "https://twitter.com/google"]
			};
	};

	static orgSchema = () => ({
			'@context'  :
				'https://schema.org',
			'@type'     :
				'Organization',
			url         :
				'https://google.com',
			name        :
				'Google',
			contactPoint: {
				'@type'    :
					'ContactPoint',
				telephone  :
					'01293019413',
				contactType:
					'Customer service'
			}
		});

	constructor(@Inject(DOCUMENT) private _document: Document) {}

	removeStructuredData(): void {
		const els : any =[];
		[ 'structured-data', 'structured-data-org','structured-data-lb' ].forEach(c => {
			els.push(...Array.from(this._document.head.getElementsByClassName(c)));
		});
    els.forEach(el => this._document.head.removeChild(el));
	}

	insertSchema(schema: string, className = 'structured-data'): void {

		let script;
		let shouldAppend = false;
		if (this._document.head.getElementsByClassName(className).length) {
			script = this._document.head.getElementsByClassName(className)[0];
		} else {
			script = this._document.createElement('script');
			shouldAppend = true;
		}
		script.setAttribute('class', className);
		script.type = JsonLDService.scriptType;
    //script.text = JSON.stringify(schema);
    script.text = schema;
    //script.text = "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"DocGenie\",\"url\":\"https://www.docgenie.in/assets/images/docgenie-logo.png\",\"priceRange\":\"telemedicine, telemedicine India, telemedicine applications, telemedicine software, telemedicine services, telemedicine jobs for doctors in India, online doctor consultation, online doctors in India\",\"telephone\":\"+919818093267\",\"email\":\"support@docgenie.in\",\"address\":{\"@type\":\"PostalAddress\",\"streetAddress\":\"L-103, Park Place,\",\"addressLocality\":\"DLF Phase 5, Gurgaon\",\"addressCountry\":\"India\",\"postalCode\":\"122010\"},\"aggregateRating\":{\"@type\":\"AggregateRating\",\"ratingValue\":\"4.9\",\"bestRating\":\"5\",\"reviewCount\":\"104\"},\"openingHours\":[\"Mon-Sat 8:00 AM - 10.00PM\"]}";
		if (shouldAppend) {
			this._document.head.appendChild(script);
		}
	}

}
