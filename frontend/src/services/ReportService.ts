import api from './api/api';
import { AxiosResponse } from 'axios';
import { ReportDto } from '@/interfaces/report/dto/ReportDto';
import Paged from '@/interfaces/paged/models/Paged';
import { createCrudUri } from '@/utils/uri';
import { SearchDto } from '@/interfaces/search/dto/SearchDto';

export default class ReportService {
    /**
     * Report a comment
     * @param {number} commentId Comment ID
     * @param {ReportDto} reportData Report details
     * @returns {Promise<AxiosResponse<ReportDto>>} Created report data
     */
    static async reportComment(commentId: number, reportData: ReportDto): Promise<AxiosResponse<ReportDto>> {
        return api.post<ReportDto>(`/api/comments/${commentId}/reports`, reportData);
    }

    /**
     * Report a review
     * @param {number} reviewId Review ID
     * @param {ReportDto} reportData Report details
     * @returns {Promise<AxiosResponse<ReportDto>>} Created report data
     */
    static async reportReview(reviewId: number, reportData: ReportDto): Promise<AxiosResponse<ReportDto>> {
        return api.post<ReportDto>(`/api/reviews/${reviewId}/reports`, reportData);
    }

    /**
     * Get all reports with pagination
     * @param {number} page Page number
     * @param {number} size Page size
     * @param {string[]} sort Sorting parameters
     * @returns {Promise<AxiosResponse<Paged<ReportDto>>>} List of all reports with pagination
     */
    static async getAllReports(page: number = 0, size: number = 20, sort: string[] = []): Promise<AxiosResponse<Paged<ReportDto>>> {
        return api.get<Paged<ReportDto>>(`/api/reports${createCrudUri(page, size, sort)}`);
    }

    /**
     * Get a report by ID
     * @param {number} id Report ID
     * @returns {Promise<AxiosResponse<ReportDto>>} Report details
     */
    static async getReportById(id: number): Promise<AxiosResponse<ReportDto>> {
        return api.get<ReportDto>(`/api/reports/${id}`);
    }

    /**
     * Delete a report by ID
     * @param {number} id Report ID
     * @returns {Promise<AxiosResponse<void>>} Response with no content
     */
    static async deleteReport(id: number): Promise<AxiosResponse<void>> {
        return api.delete<void>(`/api/reports/${id}`);
    }

    /**
     * Update a report by ID
     * @param {number} id Report ID
     * @param {ReportDto} reportData Updated report details
     * @returns {Promise<AxiosResponse<ReportDto>>} Updated report data
     */
    static async updateReport(id: number, reportData: ReportDto): Promise<AxiosResponse<ReportDto>> {
        return api.patch<ReportDto>(`/api/reports/${id}`, reportData);
    }

    /**
     * Get all pending reports
     * @param {number} page Page number
     * @param {number} size Page size
     * @param {string[]} sort Sorting parameters
     * @returns {Promise<AxiosResponse<Paged<ReportDto>>>} List of pending reports
     */
    static async getPendingReports(page: number = 0, size: number = 20, sort: string[] = []): Promise<AxiosResponse<Paged<ReportDto>>> {
        return api.get<Paged<ReportDto>>(`/reports/pending${createCrudUri(page, size, sort)}`);
    }

    /**
     * Search and filter reports
     * @param {SearchDto} searchParams Search criteria
     * @param {number} page Page number
     * @param {number} size Page size
     * @param {string[]} sort Sorting parameters
     * @returns {Promise<AxiosResponse<Paged<ReportDto>>>} List of reports matching the search criteria
     */
    static async searchReports(searchParams: SearchDto, page: number = 0, size: number = 20, sort: string[] = []): Promise<AxiosResponse<Paged<ReportDto>>> {
        return api.post<Paged<ReportDto>>(`/reports/search${createCrudUri(page, size, sort)}`, searchParams);
    }
}
