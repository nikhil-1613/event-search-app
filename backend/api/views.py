import os
import time
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json

@api_view(['GET'])
def search_events(request):
    search_term = request.GET.get("search", "").strip()
    start_str = request.GET.get("start", "").strip()
    end_str = request.GET.get("end", "").strip()
    page = int(request.GET.get("page", 1))  # Default to page 1
    page_size = int(request.GET.get("page_size", 12))  # Default to 12 results

    # Validate at least one parameter is provided
    if not (search_term or start_str or end_str):
        return Response({"error": "At least one of search term, start time, or end time is required"}, status=400)

    try:
        start = int(start_str) if start_str else 0
        end = int(end_str) if end_str else int(time.time())
        if start_str and end_str and start > end:
            return Response({"error": "Start time cannot be later than end time"}, status=400)
    except ValueError:
        return Response({"error": "Invalid start or end timestamp"}, status=400)

    print(f"\n🔎 [SEARCH STARTED]")
    print(f" → Term: '{search_term or 'N/A'}' | Start: {start} | End: {end} | Page: {page} | Page Size: {page_size}")

    base_dir = os.path.abspath("data_files/events")
    results = []

    if not os.path.exists(base_dir):
        print(f"❌ Error: Directory {base_dir} does not exist")
        return Response({"error": "Event log directory not found"}, status=500)

    total_lines, matches_found, files_scanned = 0, 0, 0
    t0 = time.time()

    for i, file in enumerate(sorted(os.listdir(base_dir))):
        path = os.path.join(base_dir, file)
        if not os.path.isfile(path):
            continue

        files_scanned += 1
        try:
            with open(path, encoding="utf-8") as f:
                for line in f:
                    total_lines += 1
                    parts = line.strip().split()

                    if len(parts) < 15:
                        continue

                    try:
                        record = {
                            "interface_id": parts[3],
                            "source_ip": parts[4],
                            "destination_ip": parts[5],
                            "packets": parts[6],
                            "bytes": parts[7],
                            "start_time": int(parts[11]),
                            "end_time": int(parts[12]),
                            "status": parts[13],
                            "action": parts[14] if len(parts) > 14 else "",
                            "filename": file,
                        }
                    except (ValueError, IndexError):
                        continue

                    # ⏱️ Time Filtering
                    if start and record["start_time"] < start:
                        continue
                    if end and record["end_time"] > end:
                        continue

                    # 🔍 Search Filter
                    if search_term:
                        is_match = False
                        if "=" in search_term:
                            key, value = map(str.strip, search_term.split("=", 1))
                            field_map = {
                                "srcaddr": record["source_ip"],
                                "dstaddr": record["destination_ip"],
                                "status": record["status"],
                                "action": record["action"]
                            }
                            is_match = field_map.get(key) == value
                        else:
                            is_match = search_term in [record["source_ip"], record["destination_ip"]]

                        if not is_match:
                            continue

                    # ✅ Add match
                    results.append(record)
                    matches_found += 1

        except Exception as e:
            print(f"❌ Error reading file {file}: {str(e)}")
            continue

    elapsed = round(time.time() - t0, 2)

    # Pagination
    total_matches = matches_found
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_results = results[start_idx:end_idx]

    # Log response size
    response_data = {
        "results": paginated_results,
        "summary": {
            "files_scanned": files_scanned,
            "lines_checked": total_lines,
            "matches": total_matches,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_matches + page_size - 1) // page_size,
            "duration_seconds": elapsed
        }
    }
    response_size = len(json.dumps(response_data).encode('utf-8')) / 1024  # Size in KB
    print(f"\n✅ [SEARCH COMPLETE]")
    print(f" → Files scanned: {files_scanned}")
    print(f" → Lines processed: {total_lines}")
    print(f" → Matches found: {total_matches}")
    print(f" → Results returned: {len(paginated_results)} (page {page})")
    print(f" → Response size: {response_size:.2f} KB")
    if total_matches > page_size:
        print(f"⚠️ Warning: {total_matches} matches found, only {len(paginated_results)} returned (page {page})")
    print(f" ⏱️ Time taken: {elapsed}s\n")

    return Response(response_data, status=200)
# import os
# import time
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# import json

# @api_view(['GET'])
# def search_events(request):
#     search_term = request.GET.get("search", "").strip()
#     start_str = request.GET.get("start", "").strip()
#     end_str = request.GET.get("end", "").strip()
#     page = int(request.GET.get("page", 1))  # Default to page 1
#     page_size = int(request.GET.get("page_size", 100))  # Default to 100 results

#     # Validate at least one parameter is provided
#     if not (search_term or start_str or end_str):
#         return Response({"error": "At least one of search term, start time, or end time is required"}, status=400)

#     try:
#         start = int(start_str) if start_str else 0
#         end = int(end_str) if end_str else int(time.time())
#         if start_str and end_str and start > end:
#             return Response({"error": "Start time cannot be later than end time"}, status=400)
#     except ValueError:
#         return Response({"error": "Invalid start or end timestamp"}, status=400)

#     print(f"\n🔎 [SEARCH STARTED]")
#     print(f" → Term: '{search_term or 'N/A'}' | Start: {start} | End: {end} | Page: {page} | Page Size: {page_size}")

#     base_dir = os.path.abspath("data_files/events")
#     results = []

#     if not os.path.exists(base_dir):
#         print(f"❌ Error: Directory {base_dir} does not exist")
#         return Response({"error": "Event log directory not found"}, status=500)

#     total_lines, matches_found, files_scanned = 0, 0, 0
#     t0 = time.time()

#     for i, file in enumerate(sorted(os.listdir(base_dir))):
#         path = os.path.join(base_dir, file)
#         if not os.path.isfile(path):
#             continue

#         files_scanned += 1
#         try:
#             with open(path, encoding="utf-8") as f:
#                 for line in f:
#                     total_lines += 1
#                     parts = line.strip().split()

#                     if len(parts) < 15:
#                         continue

#                     try:
#                         record = {
#                             "interface_id": parts[3],
#                             "source_ip": parts[4],
#                             "destination_ip": parts[5],
#                             "packets": parts[6],
#                             "bytes": parts[7],
#                             "start_time": int(parts[11]),
#                             "end_time": int(parts[12]),
#                             "status": parts[13],
#                             "action": parts[14] if len(parts) > 14 else "",
#                             "filename": file,
#                         }
#                     except (ValueError, IndexError):
#                         continue

#                     # ⏱️ Time Filtering
#                     if start and record["start_time"] < start:
#                         continue
#                     if end and record["end_time"] > end:
#                         continue

#                     # 🔍 Search Filter
#                     if search_term:
#                         is_match = False
#                         if "=" in search_term:
#                             key, value = map(str.strip, search_term.split("=", 1))
#                             field_map = {
#                                 "srcaddr": record["source_ip"],
#                                 "dstaddr": record["destination_ip"],
#                                 "status": record["status"],
#                                 "action": record["action"]
#                             }
#                             is_match = field_map.get(key) == value
#                         else:
#                             is_match = search_term in [record["source_ip"], record["destination_ip"]]

#                         if not is_match:
#                             continue

#                     # ✅ Add match
#                     results.append(record)
#                     matches_found += 1

#         except Exception as e:
#             print(f"❌ Error reading file {file}: {str(e)}")
#             continue

#     elapsed = round(time.time() - t0, 2)

#     # Pagination
#     total_matches = matches_found
#     start_idx = (page - 1) * page_size
#     end_idx = start_idx + page_size
#     paginated_results = results[start_idx:end_idx]

#     # Log response size
#     response_data = {
#         "results": paginated_results,
#         "summary": {
#             "files_scanned": files_scanned,
#             "lines_checked": total_lines,
#             "matches": total_matches,
#             "page": page,
#             "page_size": page_size,
#             "total_pages": (total_matches + page_size - 1) // page_size,
#             "duration_seconds": elapsed
#         }
#     }
#     response_size = len(json.dumps(response_data).encode('utf-8')) / 1024  # Size in KB
#     print(f"\n✅ [SEARCH COMPLETE]")
#     print(f" → Files scanned: {files_scanned}")
#     print(f" → Lines processed: {total_lines}")
#     print(f" → Matches found: {total_matches}")
#     print(f" → Results returned: {len(paginated_results)} (page {page})")
#     print(f" → Response size: {response_size:.2f} KB")
#     if total_matches > page_size:
#         print(f"⚠️ Warning: {total_matches} matches found, only {len(paginated_results)} returned (page {page})")
#     print(f" ⏱️ Time taken: {elapsed}s\n")

#     return Response({
#          "results": results,
#         "summary": {
#             "files_scanned": files_scanned,
#             "lines_checked": total_lines,
#             "matches": matches_found,
#             "duration_seconds": elapsed
#         }
#         }, status=200)