import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from '../../services/gallery';

@Component({
    selector: 'app-gallery',
    imports: [CommonModule],
    templateUrl: './gallery.html',
    styleUrl: './gallery.css'
})
export class GalleryPage implements OnInit {
    allItems: any[] = [];
    filteredItems: any[] = [];
    activeSection = 'All';
    sections = ['All', 'General', 'Performance', 'Workshop', 'Competition', 'Festival', 'Behind the Scenes'];
    loading = true;
    lightboxItem: any = null;

    constructor(private galleryService: GalleryService) { }

    ngOnInit() {
        this.loadGallery();
    }

    loadGallery() {
        this.loading = true;
        this.galleryService.getAll().subscribe({
            next: (items: any[]) => {
                this.allItems = items;
                this.applyFilter();
                this.loading = false;
            },
            error: () => { this.allItems = []; this.filteredItems = []; this.loading = false; }
        });
    }

    filterBySection(section: string) {
        this.activeSection = section;
        this.applyFilter();
    }

    applyFilter() {
        if (this.activeSection === 'All') {
            this.filteredItems = this.allItems;
        } else {
            this.filteredItems = this.allItems.filter(i => i.section === this.activeSection);
        }
    }

    get imageItems() { return this.filteredItems.filter(i => i.mediaType === 'image'); }
    get videoItems() { return this.filteredItems.filter(i => i.mediaType === 'video'); }

    openLightbox(item: any) { this.lightboxItem = item; }
    closeLightbox() { this.lightboxItem = null; }

    downloadItem(item: any, event?: Event) {
        if (event) event.stopPropagation();
        const a = document.createElement('a');
        a.href = item.secureUrl || item.url;
        a.download = item.title || item.name || 'media';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    getCategoryCount(section: string): number {
        if (section === 'All') return this.allItems.length;
        return this.allItems.filter(i => i.section === section).length;
    }
}
