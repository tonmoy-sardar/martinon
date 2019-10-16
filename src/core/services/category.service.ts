import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map, catchError } from "rxjs/operators";
import * as Globals from '../../core/global';

@Injectable()
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategoryList(categoryUrl): Observable<any> {
    return this.http.get(categoryUrl);
  }

  getSubCategoryList(cat_id,location_id): Observable<any> {
    return this.http.get(Globals.apiEndpoint + 'subcategorylist/' + cat_id + '/'+ location_id + '/')
  }

  getServicesListBySubCatId(subcat_id): Observable<any> {
    return this.http.get(Globals.apiEndpoint + 'serviceslistbysubcatid/' + subcat_id + '/')
  }
  
  getProductListByCategoryId(productUrl): Observable<any> {
    return this.http.get(productUrl)
  }

  getSearchProduct(productUrl): Observable<any> {
    return this.http.get(productUrl)
  }

  getProductList(productUrl): Observable<any> {
    return this.http.get(productUrl)
  }

  getGalleryImageList(galleryUrl): Observable<any> {
    return this.http.get(galleryUrl)
  }

  getLocationList(): Observable<any> {
    return this.http.get(Globals.apiEndpoint + 'locationlist/')
  }

  getProductDetails(productDeatilsUrl): Observable<any> {
    console.log("kkkk",productDeatilsUrl);
    return this.http.get(productDeatilsUrl)
  }
  getOrderDetails(orderDeatilsUrl): Observable<any> {
    return this.http.get(orderDeatilsUrl)
  }

  getPopularProductList(popularProductUrl): Observable<any> {
    return this.http.get(popularProductUrl)
  }
  
  getattributesList(attributesUrl): Observable<any> {
    return this.http.get(attributesUrl)
  }

  getFilterProduct(filterUrl,data): Observable<any> {
    return this.http.post(filterUrl,data)
  }

  getReviewDetails(id): Observable<any> {
    return this.http.get(Globals.apiEndpoint  +'review_by_product?product_id=' +id )
  }
  addReview(reviewUrl,data): Observable<any> {
    return this.http.post(reviewUrl,data)
  }
  // getProductDetailsVariation(product_id): Observable<any> {
  //  return this.http.get(Globals.apiEndpoint  + 'products/' + product_id + '/variations?per_page=' +100 )
  // }
  getProductDetailsVariation(product_id): Observable<any> {
    return this.http.get(Globals.apiEndpoint  +'products/' + product_id + '/variations?per_page=' +100 )
  }
  getVariationQty(variationQtyUrl): Observable<any> {
    return this.http.get(variationQtyUrl)
  }

  getAllCategory(allCatUrl): Observable<any> {
    return this.http.get(allCatUrl);
  }

  getRandomProduct(allCatUrl): Observable<any> {
    return this.http.get(allCatUrl);
  }

  getLatestProduct(orderUrl): Observable<any> {
    return this.http.get(orderUrl);
  }
  // getLatestProduct(id): Observable<any> {
  //   return this.http.get(Globals.apiEndpoint  +'products/?tag=' +id )
  // }
  getCouponList(variationQtyUrl): Observable<any> {
    return this.http.get(variationQtyUrl)
  }

  checkCoupon(url,data): Observable<any> {
    return this.http.post(url,data)
  }

  getSubCatList(url): Observable<any> {
    return this.http.get(url)
  }
  getSubcatPopularList(url): Observable<any> {
    return this.http.get(url)
  }
  getRandomsubCatProduct(url): Observable<any> {
    return this.http.get(url)
  }
  getLatestsubCatProduct(url): Observable<any> {
    return this.http.get(url)
  }
  getTaxDetails(url): Observable<any> {
    return this.http.get(url)
  }

}
