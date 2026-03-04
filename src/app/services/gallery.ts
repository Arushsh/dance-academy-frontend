import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class GalleryService {
    private BASE = 'http://localhost:5000/api/gallery';

    constructor(private http: HttpClient) { }

    getAll(section?: string) {
        const url = section && section !== 'All' ? `${this.BASE}?section=${encodeURIComponent(section)}` : this.BASE;
        return this.http.get<any[]>(url);
    }
}
