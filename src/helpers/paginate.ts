/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:19:14 pm
 * Modified By: Sara Tran
 */

import { NextFunction, Request, Response } from "express";
import { PaginationMetadata } from "~/typings/global";

/**
 * Helper class for pagination
 */
class Paginate {
  /**
   * Set limit and max limit for pagination by modifying the Request object
   * @param limit default item counts limit if not supplied in query parameter
   * @param maxLimit maximum item counts limit to ensure that the client doesn't query to many items
   * @returns an Express middleware function
   */
  middleware(limit: number, maxLimit: number) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.query.limit) {
        req.query.limit = String(limit);
        if (parseInt(req.query.limit) > maxLimit) {
          req.query.limit = String(maxLimit);
        }
      }
      next();
    };
  }

  /**
   * Return pagination metadata object
   * @param req Request object
   * @param offset offset count
   * @param limit max item count that can be returned
   * @param totalCount total count in the database
   * @param recordCount actual item count that is returned
   * @returns pagination metadata
   */
  getMetadata(
    req: Request,
    offset: number,
    limit: number,
    totalCount: number,
    recordCount: number
  ): PaginationMetadata {
    let links = {
      self: "",
      next: "",
      previous: "",
      first: "",
      last: "",
    };
    let originalURL = req.originalUrl;
    // check if the input includes offset and limit
    if (!originalURL.includes("offset=")) {
      if (!originalURL.includes("?")) {
        originalURL = originalURL + "?offset=0";
      } else {
        originalURL = originalURL + "&offset=0";
      }
    }
    if (!originalURL.includes("limit=")) {
      originalURL = originalURL + `&limit=${limit}`;
    }

    // for self link
    links.self = originalURL;
    // for first link
    links.first = originalURL.replace(`offset=${offset}`, "offset=0");
    // for last link
    links.last = originalURL.replace(
      `offset=${offset}`,
      `offset=${Math.floor(totalCount / limit) * limit}`
    );
    // for next link
    const nextOffset = offset + limit;
    if (nextOffset < totalCount) {
      links.next = originalURL.replace(
        `offset=${offset}`,
        `offset=${offset + limit}`
      );
    } else {
      links.next = originalURL;
    }
    // for previous link
    const previousOffset = offset - limit;
    if (previousOffset >= 0) {
      links.previous = originalURL.replace(
        `offset=${offset}`,
        `offset=${previousOffset}`
      );
    } else {
      links.previous = originalURL;
    }

    return {
      page: Math.ceil(offset / limit),
      per_page: limit,
      page_count: recordCount,
      total_count: totalCount,
      links,
    };
  }
}
export default new Paginate();
