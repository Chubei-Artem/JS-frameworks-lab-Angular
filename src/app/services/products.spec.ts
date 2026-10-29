import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductsService, Product } from './products';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve products via GET', () => {
    const dummyProducts: Product[] = [
      { id: 1, title: 'Keyboard', category: 'Peripherals', price: 1200 },
      { id: 2, title: 'Mouse', category: 'Peripherals', price: 800 }
    ];

    service.list().subscribe((products: Product[]) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should delete a product via DELETE', () => {
    const productId = 1;

    service.delete(productId).subscribe((response: any) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});